# ShopBot AI — AI Chat UI for E-commerce

A pixel-clean, production-ready AI shopping concierge built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Built to demonstrate frontend skills for AI-powered e-commerce experiences.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| AI | Claude claude-sonnet-4-20250514 via Anthropic API |
| Icons | Lucide React |

## Features

- **Real-time AI chat** — streaming-ready message interface with Claude
- **Product recommendation cards** — AI returns structured product data rendered as cards
- **Loading & error states** — typing indicators, error banners, disabled states
- **Accessibility** — aria-labels, keyboard navigation (Enter to send)
- **Responsive** — works on mobile and desktop
- **Reusable components** — `ChatMessage`, `ProductCard`, `TypingIndicator`
- **Clean PRs** — ESLint + Prettier configured

## Getting Started

```bash
npm install
# Add your Anthropic API key:
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/chat/route.ts   # Claude API integration
│   ├── page.tsx            # Main chat UI
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ChatMessage.tsx     # Message bubble + product cards
│   ├── ProductCard.tsx     # Product recommendation card
│   └── TypingIndicator.tsx # Animated loading dots
```

## Relevance to HelioAI

This project directly mirrors HelioAI's core product — an AI concierge for Shopify brands. It demonstrates:
- Building chat/widget surfaces in Next.js + TypeScript
- Integrating REST APIs with proper loading/error/empty states
- Clean, reusable component architecture
- Responsive, accessible UI

