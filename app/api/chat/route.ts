import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are ShopBot, a friendly AI shopping assistant for a modern Shopify store.
Help customers find products, answer questions, and make purchasing decisions.
When recommending products, include them in this exact JSON format within your response:
<products>
[{"id":"1","name":"Product Name","price":29.99,"image":"https://picsum.photos/seed/prod1/300/300","category":"Category","rating":4.5,"inStock":true}]
</products>
Use unique seed values in the picsum URL for each product (e.g. seed/shoe1, seed/bag2).
Keep responses concise, warm, and helpful. Always recommend 2-3 products when relevant.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage.content);
  const text = result.response.text();

  // Parse product recommendations
  const productMatch = text.match(/<products>([\s\S]*?)<\/products>/);
  let products = [];
  const cleanText = text.replace(/<products>[\s\S]*?<\/products>/g, "").trim();

  if (productMatch) {
    try { products = JSON.parse(productMatch[1]); } catch {}
  }

  return NextResponse.json({ text: cleanText, products });
}
