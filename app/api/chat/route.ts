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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ text: "API key not configured. Please add GROQ_API_KEY to Vercel environment variables.", products: [] });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", err);
      return NextResponse.json({ text: "AI service error: " + err.slice(0, 100), products: [] });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

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