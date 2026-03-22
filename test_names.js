const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function main() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-pro" }); // placeholder
    // In newer SDK versions, you use the listModels method on the genAI instance
    // Note: Some versions don't have listModels directly or it's on a different namespace
    // Let's try to just guess some names or check the docs if possible
    console.log("Attempting to list models...");
    // For @google/generative-ai, use the underlying client or typical names
    const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    for (const name of modelNames) {
        try {
            const model = genAI.getGenerativeModel({ model: name });
            await model.generateContent("test");
            console.log(`Model ${name} is WORKING`);
        } catch (e) {
            console.log(`Model ${name} FAILED: ${e.message}`);
        }
    }
  } catch (err) {
    console.error("Main error:", err);
  }
}

main();
