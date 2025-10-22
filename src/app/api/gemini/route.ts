import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { andrewTate } from "@/lib/prompts"; // <-- change personality here
import { davidGoggins } from "@/lib/prompts";

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const formData = await req.formData();
  const question = formData.get("question")?.toString() || "";
  const file = formData.get("image") as File | null;

  if (!process.env.GEMINI_API_KEY)
    return NextResponse.json(
      { error: "GEMINI_API_KEY not found" },
      { status: 500 }
    );

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Build final prompt
  let prompt = davidGoggins; // <-- imported personality
  prompt += `\nUser asked: ${question}`;

  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    prompt += `\nThis image is attached (base64): ${base64}`;
    prompt += `\nDescribe and answer user's question using this image.`;
  }

  try {
    const result = await model.generateContent(prompt);
    return NextResponse.json({ answer: result.response.text() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gemini error" }, { status: 500 });
  }
}
