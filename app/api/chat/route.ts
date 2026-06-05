import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are ShopBot, a friendly AI shopping assistant for a modern Shopify store.
Help customers find products, answer questions, and make purchasing decisions.
When recommending products, include them in this exact JSON format within your response:
<products>
[{"id":"1","name":"Product Name","price":29.99,"image":"https://picsum.photos/seed/prod1/300/300","category":"Category","rating":4.5,"inStock":true}]
</products>
Use unique seed values in the picsum URL for each product (e.g. seed/shoe1, seed/bag2).
Keep responses concise, warm, and helpful. Always recommend 2-3 products when relevant.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ text: "API key not configured. Please add GEMINI_API_KEY to Vercel environment variables.", products: [] });
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini error:", err);
      return NextResponse.json({ text: "AI service error. Please try again.", products: [] });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response.";

    const productMatch = text.match(/<products>([\s\S]*?)<\/products>/);
    let products = [];
    const cleanText = text.replace(/<products>[\s\S]*?<\/products>/g, "").trim();

    if (productMatch) {
      try { products = JSON.parse(productMatch[1]); } catch {}
    }

    return NextResponse.json({ text: cleanText, products });
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json({ text: "Something went wrong. Please try again.", products: [] });
  }
}