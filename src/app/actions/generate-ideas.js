"use server";

// Final deployment trigger for GEMINI_API_KEY synchronization.
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateIdeasAction(niche, style) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return { error: "CONFIG_MISSING" };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest",
    generationConfig: {
      temperature: 1.0,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    }
  });

  const prompt = `GÖREV: ${niche} nişi için ${style} tarzında 3 adet viral içerik fikri üret.
  
  FORMAT (Sadece bu JSON objesini döndür):
  {
    "ideas": [
      {
        "ideas": [
          { "title": "...", "desc": "...", "scenario": "..." },
          { "title": "...", "desc": "...", "scenario": "..." },
          { "title": "...", "desc": "...", "scenario": "..." }
        ],
        "tip": "..."
      }
    - JSON bloğunu \`\`\`json ve \`\`\` arasına alabilirsin.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Markdown code blocks temizleme
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      const info = `Len: ${text.length}, First: ${firstBrace}, Last: ${lastBrace}`;
      return { error: `PARSE_ERROR_NO_JSON: ${info}. Başlangıç: ${text.slice(0, 50)}...` };
    }

    const jsonString = text.substring(firstBrace, lastBrace + 1);
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch (parseErr) {
      return { error: `PARSE_ERROR_INVALID: ${jsonString.slice(0, 50)}...` };
    }

    // Fikir sayısını doğrula, LLM bazen eksik verebilir
    if (!data.ideas || data.ideas.length === 0) {
      return { error: "EMPTY_RESULT" };
    }

    return data;
  } catch (error) {
    console.error("Gemini API Error details:", error);
    const apiErrorMsg = error.message || "Bilinmeyen API Hatası";
    return { error: `API_ERROR: ${apiErrorMsg.slice(0, 500)}` };
  }
}
