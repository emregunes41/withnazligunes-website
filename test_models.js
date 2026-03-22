const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent("ping");
    console.log("Success with gemini-1.5-flash");
  } catch (err) {
    console.log("Error with gemini-1.5-flash:", err.message);
    try {
        const result2 = await genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }).generateContent("ping");
        console.log("Success with gemini-1.5-flash-latest");
    } catch (err2) {
        console.log("Error with gemini-1.5-flash-latest:", err2.message);
    }
  }
}

listModels();
