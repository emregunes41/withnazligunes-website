const { generateContent } = require("@google/generative-ai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("NO GEMINI API KEY!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const prompt = `
    Görevin:
    1. Bu niş ve tarza uygun, etkileşim (viral) potansiyeli yüksek, KESİNLİKLE VE TAM OLARAK 3 ADET ÇOK DETAYLI içerik fikri üret. Sadece 1 tane üretme, mutlaka 3 tane farklı fikir ver.
    2. Her fikir için:
       - 'title': Çarpıcı ve dikkat çekici bir başlık.
       - 'desc': Stratejik ve ufuk açıcı, vizyon katan çok detaylı bir açıklama (neden işe yarayacağı, hangi psikolojik tetikleyicileri kullandığı vb. en az 3-4 cümle).
       - 'scenario': Çekim açıları, kamera hareketleri ve kurgu fikirleri içeren çok detaylı ve profesyonel 3 adımlı bir senaryo (Hook, Body, CTA formatında, her adım ayrı satırda).
    3. 1 adet 'tip': Daha fazla etkileşim için ufuk açıcı, nişe özel, nadir bilinen bir profesyonel ipucu.

    DİL: TÜRKÇE
    FORMAT: Sadece saf JSON objesi döndür. Markdown veya ek açıklama ekleme.
    
    Niş: Moda & Stil
    Tarz: Minimalist & Sade
`;

async function main() {
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("----- RAW AI TEXT -----");
    console.log(text);
    console.log("----- EXTRACTION TEST -----");
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.log("REGEX FAILED TO FIND JSON");
    } else {
      console.log("EXTRACTED STRING:");
      console.log(match[0]);
      console.log("----- JSON PARSE -----");
      const obj = JSON.parse(match[0]);
      console.log(obj);
      console.log("SUCCESS!");
    }
  } catch (err) {
    console.error("FATAL ERROR", err);
  }
}

main();
