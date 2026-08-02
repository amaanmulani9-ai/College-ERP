import React, { useState, useRef, useEffect } from "react";
import {
  Send, ThumbsUp, ThumbsDown, Copy, RefreshCw,
  Plus, Loader2, Bot, User, CheckCheck,
} from "lucide-react";
import type { AIConversation, AIFeedback } from "./useAIWorkspace";

// ─── Minimal markdown renderer ────────────────────────────────────────────────
const renderMarkdown = (text: string): React.ReactNode => {
  if (!text) return null;
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="mt-2 mb-2 p-3 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-[11px] text-emerald-300 font-mono leading-relaxed">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-xs font-bold text-white mt-2 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-sm font-bold text-white mt-2 mb-1">{line.slice(3)}</h2>);
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(<p key={i} className="text-xs font-bold text-white">{line.slice(2, -2)}</p>);
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <li key={i} className="text-xs text-slate-200 leading-relaxed ml-3 list-disc">
          {line.slice(2)}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-1.5" />);
    } else {
      elements.push(<p key={i} className="text-xs text-slate-200 leading-relaxed">{line}</p>);
    }
    i++;
  }
  return <>{elements}</>;
};

interface AIQuickChatProps {
  conversation: AIConversation | null;
  isLoading: boolean;
  onSend: (prompt: string) => void;
  onNew: () => void;
  onFeedback: (msgId: string, feedback: AIFeedback) => void;
}

export const AIQuickChat: React.FC<AIQuickChatProps> = ({
  conversation, isLoading, onSend, onNew, onFeedback,
}) => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => { /* silent */ });
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {!conversation || conversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">AI Academic Assistant</div>
              <div className="text-xs text-slate-400 mt-1">
                Ask anything about your ERP data, students, fees, placements, or generate reports and drafts.
              </div>
            </div>
            <div className="text-[10px] text-slate-600">Powered by placeholder provider · Ctrl+Shift+A to toggle</div>
          </div>
        ) : (
          conversation.messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center ${
                msg.role === "user" ? "bg-indigo-600" : "bg-slate-800 border border-slate-700"
              }`}>
                {msg.role === "user"
                  ? <User className="w-3.5 h-3.5 text-white" />
                  : <Bot  className="w-3.5 h-3.5 text-indigo-400" />}
              </div>

              {/* Bubble */}
              <div className={`flex-1 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`rounded-2xl px-3.5 py-2.5 ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-slate-900 border border-slate-800 rounded-tl-sm"
                }`}>
                  {msg.isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      <span className="text-xs text-slate-400">Generating response…</span>
                    </div>
                  ) : msg.role === "user" ? (
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
                  )}
                </div>

                {/* Actions row for assistant messages */}
                {msg.role === "assistant" && !msg.isLoading && (
                  <div className="flex items-center gap-1 px-1">
                    <button onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors"
                      title="Copy">
                      {copiedId === msg.id ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => onFeedback(msg.id, msg.feedback === "positive" ? null : "positive")}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors ${msg.feedback === "positive" ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400"}`}
                      title="Good response">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onFeedback(msg.id, msg.feedback === "negative" ? null : "negative")}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors ${msg.feedback === "negative" ? "text-rose-400" : "text-slate-500 hover:text-rose-400"}`}
                      title="Poor response">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                    <button className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-amber-400 transition-colors" title="Regenerate (placeholder)">
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div className="flex items-end gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500/60 transition-colors">
          <button onClick={onNew} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white mb-0.5 flex-shrink-0" title="New conversation">
            <Plus className="w-4 h-4" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask the AI anything… (Enter to send, Shift+Enter for newline)"
            rows={1}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed max-h-24 overflow-y-auto"
            style={{ minHeight: 28 }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all mb-0.5 flex-shrink-0 shadow-lg shadow-indigo-600/20"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
