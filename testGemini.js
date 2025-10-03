import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// load your env manually (Windows safe)
dotenv.config({ path: path.resolve("./.env.local") });

const run = async () => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ No GEMINI_API_KEY found");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta1"
  });

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent("Say hi like a 5-year-old");
    console.log(result.response.text());
  } catch (err) {
    console.error("Gemini API error:", err);
  }
};

run();
