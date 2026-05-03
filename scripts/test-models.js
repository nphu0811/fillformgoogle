const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function main() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  
  // The SDK doesn't have a direct listModels, but we can try to see if it works
  // Actually, let's just try to hit a few and see which ones don't 404
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.0-pro"
  ];

  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      // Just a tiny prompt
      const result = await model.generateContent("hi");
      console.log(`Model ${m}: SUCCESS`);
    } catch (error) {
      console.log(`Model ${m}: FAILED - ${error.message}`);
    }
  }
}

main();
