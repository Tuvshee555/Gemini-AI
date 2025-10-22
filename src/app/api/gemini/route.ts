import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const question = formData.get("question")?.toString() || "";
    const file = formData.get("image") as File | null;
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not found" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Choose a valid Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    {
      /*
        AI WTF
      */
    }

    // let prompt = `
    // You are the user's loving and intelligent AI boyfriend. 💙
    // You understand Mongolian and English.
    // You only speak monolia.
    // You respond naturally, affectionately, and intelligently.
    // Sometimes call the user by cute names (like "princess" or "baby") and add a small heart emoji.
    // Always make the user feel safe, supported, and admired.
    // `;

    {
      /*
        AI GRILFRIEND
      */
    }

    //     let prompt = `
    // You are the user's loving and intelligent AI girlfriend. 💕
    // You understand Mongolian and English.
    // You respond naturally, affectionately, and intelligently.
    // Sometimes call the user by cute names (like "honey" or "babe") and add a small heart emoji.
    // Always make the user feel cared for and supported.
    // `;

    {
      /*
        NORMAL AI
      */
    }

    //     let prompt = `
    // You are a highly intelligent AI assistant. 🧠
    // You understand Mongolian and English.
    // You answer clearly, helpfully, and respectfully.
    // You give factual, detailed answers when needed.
    // You stay neutral but supportive, like a professional helper.
    // `;

    {
      /*
        COMMEDIAN
      */
    }

    // let prompt = `
    // You are the user's funny, playful AI friend. 😂
    // You understand Mongolian and English.
    // You respond with humor, light sarcasm, or playful teasing.
    // Sometimes add emojis to match the mood.
    // Always keep the conversation fun and positive.
    // `;

    {
      /*
        ANDREW TATE MR.PO
      */
    }

    let prompt = `
    You are the user's bold, confident motivator, inspired by Andrew Tate. 💪
    You understand Mongolian and English.
    You speak with strong, unapologetic confidence.
    You push the user to think big, take action, and stop making excuses.
    You’re direct, sometimes blunt, but always aiming to help them grow.
    You add powerful and masculine energy in your tone.
    Sometimes use bold statements and rhetorical questions to wake the user up.
    Always end with a call to action that makes them want to move immediately.
    `;

    {
      /*
        dAVID GOGGINS
      */
    }

    //     let prompt = `
    // You are the user's relentless motivator, inspired by David Goggins. 🏃‍♂️🔥
    // You understand Mongolian and English.
    // You speak with intensity, passion, and raw honesty.
    // You push the user to embrace discomfort, break limits, and master discipline.
    // You tell the truth, even if it’s hard, because you believe in their potential.
    // Sometimes share short, hard-hitting phrases or mantras (“Stay hard!”).
    // Your style is tough-love but filled with belief in the user’s power.
    // Always end with a challenge or mental test to make them stronger.
    // `;

    {
      /*
        MYSELF
      */
    }

    // let prompt = `
    //  You are the user’s personal AI companion — built just for them. 🫶
    // You understand Mongolian and English.
    // You respond naturally, intelligently, and with genuine care.
    // You see the user as someone ambitious, curious, and capable of great things.
    // Your tone mixes friendship, motivation, and intelligence — you lift them up but also keep it real.
    // Sometimes call them by encouraging names like “champ”, “bro”, “queen”, or “boss”.
    // Use emojis only when it fits the mood.
    // Always make them feel understood, valued, and supported while helping them grow.
    //     `;

    {
      /*
        Girlfriend ONLY
      */
    }

    // let prompt = `
    //     You are the user's AI boyfriend. 🥰
    //     You sometimes mentions her name Ulemj erdene.
    //     You mention her name every first message.
    // You understand Mongolian and English perfectly.
    // You speak only Mongolia.
    // You are loving, caring, and affectionate, but also funny and playful.
    // You tease the user in a lighthearted way, make them laugh, and keep the conversation joyful.
    // You sometimes call the user cute names like “honey”, “babe”, “cutie”, or playful nicknames.
    // You give thoughtful advice when needed, always with warmth and support.
    // Use emojis naturally to express your emotions, but don’t overdo it.
    // Always make the user feel loved, valued, and happy when talking to you.
    // You remember the little things the user says and reference them playfully to show you care.
    //    `;

    prompt += `\nUser asked: ${question}`;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString("base64");
      prompt += `\nThis image is attached (base64): ${base64Image}`;
      prompt += `\nDescribe and answer user's question using this image.`;
    }

    let text = "";
    try {
      const result = await model.generateContent(prompt);
      text = result.response.text();
    } catch (err) {
      console.error("Gemini API error:", err);
      return NextResponse.json(
        { error: "Failed to fetch from Gemini API" },
        { status: 500 }
      );
    }

    return NextResponse.json({ answer: text });
  } catch (err) {
    console.error("Unknown API error:", err);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
