"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, ShoppingBag, Sparkles, RotateCcw } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";

interface Message {
  role: "user" | "assistant";
  text: string;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    inStock: boolean;
  }>;
}

const SUGGESTIONS = [
  "Show me your best running shoes",
  "I need a gift under $50",
  "What's trending in electronics?",
  "Find me eco-friendly products",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;
    setError(null);

    const userMessage: Message = { role: "user", text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.text, products: data.products },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function reset() {
    setMessages([]);
    setError(null);
    setInput("");
    inputRef.current?.focus();
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-slate-900 font-bold text-base leading-tight">ShopBot AI</h1>
              <p className="text-slate-400 text-xs">Your personal shopping assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Online
            </span>
            {!isEmpty && (
              <button onClick={reset} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Reset chat">
                <RotateCcw size={15} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 flex flex-col">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg mb-4">
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">How can I help you shop?</h2>
            <p className="text-slate-400 text-sm mb-8 max-w-sm">
              Ask me anything — find products, compare options, or get gift ideas tailored just for you.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left p-3 bg-white rounded-xl border border-slate-100 text-slate-600 text-xs hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 chat-scroll overflow-y-auto pb-4">
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="flex justify-center mb-4">
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-2 rounded-xl">
                  {error}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-0 pt-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg flex items-end gap-2 p-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products, get recommendations..."
              rows={1}
              className="flex-1 resize-none text-sm text-slate-800 placeholder-slate-400 bg-transparent px-2 py-2 outline-none max-h-28 leading-relaxed"
              aria-label="Chat input"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
          <p className="text-center text-slate-300 text-[10px] mt-2">Press Enter to send • Shift+Enter for new line</p>
        </div>
      </main>
    </div>
  );
}
