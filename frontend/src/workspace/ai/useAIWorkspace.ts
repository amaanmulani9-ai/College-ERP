import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AIMessageRole = "user" | "assistant" | "system";
export type AIFeedback = "positive" | "negative" | null;

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  timestamp: number;
  feedback: AIFeedback;
  isLoading?: boolean;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AIUsageStats {
  todayPrompts: number;
  estimatedTokens: number;
  avgResponseMs: number;
  provider: string;
  model: string;
}

export interface AIContext {
  module: string;
  page: string;
  userRole: string;
  tenant: string;
  academicSession: string;
  breadcrumb: string;
}

// ─── Placeholder API ──────────────────────────────────────────────────────────

const PLACEHOLDER_RESPONSES: string[] = [
  "Based on the current academic data, I can see attendance trends improving this semester. The overall attendance rate stands at 87.4%, up from 82.1% last semester.",
  "The fee collection for this month shows ₹12.4L collected against a target of ₹15.2L. Key defaulters in Semester 3 CS department need follow-up.",
  "Examining the placement records, 73 students have been placed so far this academic year. TechCorp, Infosys, and Wipro are the top recruiters with 18, 12, and 9 placements respectively.",
  "The library utilization report shows 142 books currently issued, 23 overdue. Computer Science and Electronics sections have the highest circulation.",
  "Hostel occupancy stands at 94.2% (282/299 rooms). Block B, Wing 3 has 6 vacant rooms available for new allotments.",
  "Based on your current context, I recommend reviewing the pending fee due list for Semester 3 students before the monthly board meeting.",
  "The timetable for the upcoming semester requires 3 adjustments — two faculty conflicts detected in the CS department schedule.",
  "I've analyzed the exam results. The average GPA this semester is 7.84. 12 students are at academic risk and may need counseling support.",
];

let promptCounter = 0;

export async function callPlaceholderAI(
  prompt: string,
  _context: AIContext
): Promise<string> {
  // Simulate API latency
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
  promptCounter++;
  const idx = Math.floor(Math.random() * PLACEHOLDER_RESPONSES.length);
  return PLACEHOLDER_RESPONSES[idx];
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const CONV_KEY  = "college_erp_ai_conversations";
const USAGE_KEY = "college_erp_ai_usage";

// ─── Default Context ──────────────────────────────────────────────────────────

export const getDefaultContext = (): AIContext => ({
  module:          typeof window !== "undefined" ? window.location.pathname.split("/")[1] || "dashboard" : "dashboard",
  page:            typeof window !== "undefined" ? window.location.pathname : "/",
  userRole:        "administrator",
  tenant:          "Springfield Academic Cloud",
  academicSession: "2025–2026",
  breadcrumb:      "Workspace › AI Assistant",
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAIWorkspace() {
  const [conversations, setConversations] = useState<AIConversation[]>(() => {
    try { const r = localStorage.getItem(CONV_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
  });

  const [activeConvId, setActiveConvId] = useState<string | null>(
    () => conversations[0]?.id ?? null
  );

  const [usage, setUsage] = useState<AIUsageStats>(() => {
    try { const r = localStorage.getItem(USAGE_KEY); return r ? JSON.parse(r) : { todayPrompts: 0, estimatedTokens: 0, avgResponseMs: 0, provider: "Placeholder (OpenAI-compatible)", model: "gpt-placeholder-v1" }; } catch {
      return { todayPrompts: 0, estimatedTokens: 0, avgResponseMs: 0, provider: "Placeholder (OpenAI-compatible)", model: "gpt-placeholder-v1" };
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const context = useRef<AIContext>(getDefaultContext());

  // Persist conversations
  useEffect(() => {
    try { localStorage.setItem(CONV_KEY, JSON.stringify(conversations)); } catch { /* silent */ }
  }, [conversations]);

  // Persist usage
  useEffect(() => {
    try { localStorage.setItem(USAGE_KEY, JSON.stringify(usage)); } catch { /* silent */ }
  }, [usage]);

  // Ctrl+Shift+A global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const createConversation = useCallback((initialPrompt?: string): string => {
    const id = `conv-${Date.now()}`;
    const newConv: AIConversation = {
      id,
      title: initialPrompt ? initialPrompt.slice(0, 40) + "…" : "New Conversation",
      messages: [],
      isPinned: false,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(id);
    return id;
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConvId) ?? null;

  const sendMessage = useCallback(async (prompt: string, convId?: string) => {
    const targetId = convId ?? activeConvId ?? createConversation(prompt);

    const userMsg: AIMessage = { id: `msg-u-${Date.now()}`, role: "user", content: prompt, timestamp: Date.now(), feedback: null };
    const loadingMsg: AIMessage = { id: `msg-a-${Date.now()}`, role: "assistant", content: "", timestamp: Date.now(), feedback: null, isLoading: true };

    setConversations((prev) => prev.map((c) => c.id === targetId
      ? { ...c, messages: [...c.messages, userMsg, loadingMsg], updatedAt: Date.now(), title: c.messages.length === 0 ? prompt.slice(0, 40) + "…" : c.title }
      : c
    ));

    setIsLoading(true);
    const start = Date.now();

    try {
      const response = await callPlaceholderAI(prompt, context.current);
      const elapsed = Date.now() - start;

      setConversations((prev) => prev.map((c) => c.id === targetId
        ? { ...c, messages: c.messages.map((m) => m.id === loadingMsg.id ? { ...m, content: response, isLoading: false } : m) }
        : c
      ));

      setUsage((prev) => ({
        ...prev,
        todayPrompts: prev.todayPrompts + 1,
        estimatedTokens: prev.estimatedTokens + Math.floor(prompt.length / 4) + Math.floor(response.length / 4),
        avgResponseMs: Math.round((prev.avgResponseMs * prev.todayPrompts + elapsed) / (prev.todayPrompts + 1)),
      }));
    } catch {
      setConversations((prev) => prev.map((c) => c.id === targetId
        ? { ...c, messages: c.messages.map((m) => m.id === loadingMsg.id ? { ...m, content: "⚠️ AI provider unavailable. This is a placeholder integration.", isLoading: false } : m) }
        : c
      ));
    } finally {
      setIsLoading(false);
    }
  }, [activeConvId, createConversation]);

  const pinConversation = useCallback((id: string) => {
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
  }, []);

  const favoriteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeConvId === id) setActiveConvId(remaining[0]?.id ?? null);
      return remaining;
    });
  }, [activeConvId]);

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, title } : c));
  }, []);

  const setFeedback = useCallback((convId: string, msgId: string, feedback: AIFeedback) => {
    setConversations((prev) => prev.map((c) => c.id === convId
      ? { ...c, messages: c.messages.map((m) => m.id === msgId ? { ...m, feedback } : m) }
      : c
    ));
  }, []);

  return {
    conversations,
    activeConversation,
    activeConvId,
    setActiveConvId,
    usage,
    isOpen,
    setIsOpen,
    isLoading,
    createConversation,
    sendMessage,
    pinConversation,
    favoriteConversation,
    deleteConversation,
    renameConversation,
    setFeedback,
    context: context.current,
  };
}
