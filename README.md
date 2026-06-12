# ShopBot AI 🛍️

An AI-powered shopping assistant chatbot with a clean, responsive chat UI. Built with Next.js 14, TypeScript, and the Groq API running the LLaMA 3.3 70B model for fast, intelligent responses.

---

## Live Demo

> **Live:** https://shopbot-ai-wheat.vercel.app

---

## Features

- **AI Chat Interface** — conversational shopping assistant powered by LLaMA 3.3 70B via Groq
- **Fast Inference** — Groq's LPU hardware delivers near-instant responses
- **Streaming Responses** — text streams in real-time as the model generates
- **Chat History** — conversation context maintained across messages
- **Responsive UI** — works on desktop and mobile
- **System Prompt** — custom prompt makes the AI behave as a shopping assistant

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Model | LLaMA 3.3 70B (via Groq API) |
| Deployment | Vercel |

---

## Project Structure

```
shopbot-ai/
├── app/
│   ├── api/chat/route.ts    ← API route — calls Groq, streams response
│   ├── page.tsx             ← Chat UI page
│   └── layout.tsx
├── components/
│   ├── ChatWindow.tsx       ← Message list with scroll
│   ├── MessageBubble.tsx    ← User/AI message styling
│   └── InputBar.tsx         ← Message input + send button
└── lib/
    └── groq.ts              ← Groq client setup
```

---

## How It Works

```ts
// app/api/chat/route.ts
const response = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [
    { role: 'system', content: 'You are ShopBot, a helpful shopping assistant...' },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ],
  stream: true,
})
```

The API route receives the conversation history, appends the system prompt, calls Groq, and streams the response back to the frontend.

---

## Local Setup

```bash
git clone https://github.com/SwathiGuttula/shopbot-ai.git
cd shopbot-ai
npm install
```

Create a `.env.local` file:
```env
GROQ_API_KEY=your_groq_api_key
```

Get a free API key at [console.groq.com](https://console.groq.com) — no credit card needed.

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Deployment

Deployed on Vercel with `GROQ_API_KEY` set as an environment variable. Any push to main triggers auto-deploy.

---

## Author

**Swathi Guttula**  
B.Tech Computer Science, KL University  
[GitHub](https://github.com/SwathiGuttula) · [LinkedIn](https://linkedin.com/in/swathiguttula)
