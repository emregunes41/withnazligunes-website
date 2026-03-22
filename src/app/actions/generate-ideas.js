"use server";

// Final deployment trigger for GEMINI_API_KEY synchronization.
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateIdeasAction(niche, style) {
  let apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    // Deep search by value prefix
    const foundKey = Object.keys(process.env).find(k => 
      process.env[k] && typeof process.env[k] === 'string' && process.env[k].startsWith("AIza")
    );
    
    if (foundKey) {
      console.log(`Found matching key by value prefix: ${foundKey}`);
      apiKey = process.env[foundKey];
    } else {
      const geminiKeys = Object.keys(process.env).filter(k => k.toUpperCase().includes("GEMINI"));
      const keysCount = Object.keys(process.env).length;
      return { error: `ERR_DEEP_FAIL: 'AIza' ile başlayan değer bulunamadı. Toplam Key: ${keysCount}. Benzer İsimler: [${geminiKeys.join(", ") || "YOK"}]. v1.0.5` };
    }
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
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
      return { error: "ERR_PARSE_FAIL: Geçerli bir JSON formatı üretilemedi." };
    }

    const data = JSON.parse(jsonMatch[0]);

    // Fikir sayısını doğrula, LLM bazen eksik verebilir
    if (!data.ideas || data.ideas.length === 0) {
      return { error: "ERR_EMPTY_RESULT: AI boş sonuç döndü." };
    }

    return data;
  } catch (error) {
    console.error("Gemini API Error details:", error);
    const msg = error.message || "Unknown Error";
    return { error: `ERR_API_FAIL: ${msg}` };
  }
}
