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
    model: "gemini-1.5-flash", 
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `GÖREV: ${niche} nişi için ${style} tarzında 3 adet detaylı viral içerik fikri üret.
  
  FORMAT (SADECE JSON DÖNDÜR):
  {
    "ideas": [
      {
        "title": "Vuran Bir Başlık",
        "desc": "Neden viral olacağı ve özet (en az 3 cümle)",
        "scenario": "Senaryo detayları (Hook, Gelişme, Final)"
      }
    ],
    "tip": "Profesyonel vizyoner tüyo"
  }
  
  DİL: Türkçe. Çıktıda yalnızca JSON olsun.`;

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
      return { error: `PARSE_ERROR_NO_JSON: ${info}. Text: ${text.slice(0, 100)}...` };
    }

    const jsonString = text.substring(firstBrace, lastBrace + 1);
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch (parseErr) {
      return { error: `PARSE_ERROR_INVALID: ${jsonString.slice(0, 50)}...` };
    }

    if (!data.ideas || data.ideas.length === 0) {
      return { error: "EMPTY_RESULT" };
    }

    return data;
  } catch (error) {
    console.error("Gemini API Error details:", error);
    return { error: `API_ERROR: ${error.message || "Bilinmeyen API Hatası"}` };
  }
}
