import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  Button,
  StatusBadge,
} from "../../design-system";
import { Bot, Send, User, Sparkles, RefreshCw, Zap } from "lucide-react";

interface MessageItem {
  id: string;
  sender: "user" | "assistant";
  text: string;
  tokens?: number;
}

export const AssistantPage: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Hello! I am your Enterprise AI Academic Assistant. How can I help you today? You can ask about student attendance, exam analysis, fee balances, placement recommendations, or institutional policies.",
      tokens: 45,
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const userMsg: MessageItem = { id: Date.now().toString(), sender: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI Service response
    setTimeout(() => {
      let reply = `As an Enterprise AI Academic Assistant, I have processed your query regarding: "${userText}". All student records and academic parameters are fully synchronized.`;
      const lower = userText.toLowerCase();

      if (lower.includes("attendance")) {
        reply = "Institutional Attendance Analysis: Overall student attendance is 88.4%. Semester 6 Computer Science shows 12 students below the 75% mandatory threshold.";
      } else if (lower.includes("exam") || lower.includes("result")) {
        reply = "Exam Performance Insights: Class average for Mid-Term Examinations is 76.2%. Data Structures & AI algorithms recorded the highest grade distribution.";
      } else if (lower.includes("fee") || lower.includes("payment")) {
        reply = "Fee Status Notification: 92% of semester fees collected. Auto-generated payment reminders scheduled for 18 pending student accounts.";
      } else if (lower.includes("placement")) {
        reply = "Placement Match Recommendations: Top corporate fit for your profile is Google (Software Engineer - 94% match) and Microsoft (Cloud Solutions Architect - 91% match).";
      }

      const asstMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: reply,
        tokens: Math.floor(Math.random() * 100) + 80,
      };

      setMessages((prev) => [...prev, asstMsg]);
      setLoading(false);
    }, 600);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Interactive AI Academic Assistant"
        subtitle="Provider-agnostic AI chat assistant for students, faculty, parents, and administrators"
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge label="ENGINE: DEFAULT ACADEMIC (gpt-4o-mini)" variant="success" />
            <Button variant="ghost" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => setMessages([])}>
              Clear Session
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-4">
        {/* Suggested Quick Prompts */}
        <div className="md:col-span-1 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-4 h-4 text-indigo-400" />
            Suggested Quick Prompts
          </h4>
          <div className="space-y-2">
            {[
              "Summarize CSE Sem 6 Attendance",
              "Analyze Mid-Term Exam Results",
              "Draft Fee Reminder Notice",
              "Recommend Top Placement Matches",
              "Explain Library Borrowing Policy",
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInput(prompt)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-800/80 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat UI Panel */}
        <div className="md:col-span-3 flex flex-col h-[560px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${
                  m.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl text-white ${
                    m.sender === "user" ? "bg-indigo-600" : "bg-slate-800 text-indigo-400"
                  }`}
                >
                  {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.tokens && (
                    <span className="block text-[10px] text-slate-500 mt-2 text-right">
                      {m.tokens} tokens
                    </span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3 text-xs text-indigo-400 italic">
                <Bot className="w-4 h-4 animate-spin" />
                AI Assistant is thinking...
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Academic Assistant a question..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-xs text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <Button type="submit" variant="primary" leftIcon={<Send className="w-4 h-4" />} disabled={loading}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};
