export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow">
        AI
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5 h-4">
          <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full block" />
          <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full block" />
          <span className="typing-dot w-2 h-2 bg-slate-400 rounded-full block" />
        </div>
      </div>
    </div>
  );
}
