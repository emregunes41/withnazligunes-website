"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateIdeasAction(niche, style) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    throw new Error("AI Configuration is missing. Please add GEMINI_API_KEY to environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Sen bir sosyal medya stratejisti ve Nazlı Güneş'in (withnazligunes) yapay zeka asistanısın. 
    Kullanıcının verileri:
    Niş: ${niche}
    Tarz: ${style}
    Görevin:
    1. Bu niş ve tarza uygun, etkileşim (viral) potansiyeli yüksek, KESİNLİKLE VE TAM OLARAK 3 ADET ÇOK DETAYLI içerik fikri üret. Sadece 1 tane üretme, mutlaka 3 tane farklı fikir ver.
    2. Her fikir için:
       - 'title': Çarpıcı ve dikkat çekici bir başlık.
       - 'desc': Stratejik ve ufuk açıcı, vizyon katan çok detaylı bir açıklama (neden işe yarayacağı, hangi psikolojik tetikleyicileri kullandığı vb. en az 3-4 cümle).
       - 'scenario': Çekim açıları, kamera hareketleri ve kurgu fikirleri içeren çok detaylı ve profesyonel 3 adımlı bir senaryo (Hook, Body, CTA formatında, her adım ayrı satırda).
    3. 1 adet 'tip': Daha fazla etkileşim için ufuk açıcı, nişe özel, nadir bilinen bir profesyonel ipucu.

    DİL: TÜRKÇE
    FORMAT: Sadece saf JSON objesi döndür. Markdown veya ek açıklama ekleme.
    
    JSON Yapısı:
    {
      "ideas": [
        { "title": "...", "desc": "...", "scenario": "..." },
        { "title": "...", "desc": "...", "scenario": "..." },
        { "title": "...", "desc": "...", "scenario": "..." }
      ],
      "tip": "..."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON temizleme (bazı modeller markdown bloğu içinde döndürebiliyor)
    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Fikirler oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
  }
}
