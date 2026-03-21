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
    1. Bu niş ve tarza uygun, etkileşim (viral) potansiyeli yüksek 3 adet içerik fikri üret.
    2. Her fikir için:
       - 'title': Çarpıcı bir başlık.
       - 'desc': Stratejik bir açıklama (neden işe yarayacağı).
       - 'scenario': 3 adımlı bir senaryo (Hook, Body, CTA formatında, her adım yeni satırda).
    3. 1 adet 'tip': Ufuk açıcı, nişe özel bir uzman tavsiyesi.

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
