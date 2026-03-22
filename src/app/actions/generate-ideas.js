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
      temperature: 1.0,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    }
  });

  const prompt = `
    Sen bir sosyal medya stratejisti ve Nazlı Güneş'in (withnazligunes) üst düzey yapay zeka asistanısın. 
    
    Kullanıcı Verileri:
    - Niş: ${niche}
    - Tarz: ${style}

    GÖREV:
    Bu niş ve tarz için etkileşim potansiyeli en yüksek, KESİNLİKLE 3 ADET BİRBİRİNDEN FARKLI ve ÇOK DETAYLI içerik fikri üret. 

    Her fikir için şu alanları doldur:
    1. 'title': Merak uyandıran, tıklanma oranı yüksek bir başlık.
    2. 'desc': Fikrin neden işe yarayacağını, hangi kitleye hitap ettiğini ve stratejik amacını açıklayan en az 4 cümlelik derinlemesine analiz.
    3. 'scenario': Profesyonel çekim ve kurgu detayları. 3 adımda (Hook, Body, CTA) yazılmalı ve her adım yeni bir satırda olmalıdır.

    Ayrıca:
    - 'tip': Bu nişe özel, nadir bilinen ve vizyon katan profesyonel bir tüyo.

    KURALLAR:
    - Dil: Türkçe
    - Yanıt sadece saf JSON objesi olmalıdır.
    - JSON objesi şu yapıda olmalıdır:
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
    const text = response.text();
    
    // JSON bloğunu temizleme
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { error: "PARSE_ERROR" };
    }

    const data = JSON.parse(jsonMatch[0]);

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
