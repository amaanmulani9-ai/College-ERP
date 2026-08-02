import React, { useState } from "react";
import { Sparkles, Send, MessageSquare, Cpu, ExternalLink, Zap, RefreshCw } from "lucide-react";

const QUICK_PROMPTS = [
  "Summarize fee overdues for Sem 6",
  "Predict admission conversion rate",
  "Draft attendance warning notice",
  "Generate hostel vacancy report",
];

const RECENT_CHATS = [
  "Analyzed 2026 CS Department attendance dips",
  "Generated fee structure comparison matrix",
  "Drafted faculty leave policy summary",
];

export const MobileWorkspaceAI: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hello Amaan! How can I assist your ERP workflow today?" },
  ]);
  const [loading, setLoading] = useState(false);

  const sendPrompt = (textToSend?: string) => {
    const query = textToSend ?? prompt;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: "user" as const, text: query }];
    setMessages(newMsgs);
    setPrompt("");
    setLoading(true);

    setTimeout(() => {
      setMessages([
        ...newMsgs,
        {
          sender: "ai",
          text: `Analysis complete for "${query}". 12,450 records scanned. Recommended action: Approve pending verification.`,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      {/* Header & Token Usage */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-xs">AI Workspace Assistant</h3>
            <p className="text-[9px] text-slate-500 font-mono">Gemini 3.6 Flash / Local Engine</p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
          98.4% Token Limit
        </span>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="space-y-1">
        <p className="text-[9px] font-bold font-mono text-slate-500 uppercase">Suggested Prompts</p>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {QUICK_PROMPTS.map((qp) => (
            <button
              key={qp}
              onClick={() => sendPrompt(qp)}
              className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-300 rounded-xl text-[10px] whitespace-nowrap transition-colors"
            >
              ⚡ {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation History Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl max-w-[90%] ${
              m.sender === "user"
                ? "bg-indigo-600 text-white ml-auto text-right font-medium"
                : "bg-slate-900 border border-slate-800 text-slate-200"
            }`}
          >
            <p className="text-[11px] leading-relaxed">{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>AI Copilot thinking…</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI Copilot anything…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendPrompt()}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600"
        />
        <button
          onClick={() => sendPrompt()}
          disabled={!prompt.trim() || loading}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
