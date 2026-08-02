import React, { useState } from "react";
import {
  Sparkles, MessageSquare, Library, Lightbulb,
  History, BarChart3, ChevronRight, X,
} from "lucide-react";
import { useAIWorkspace } from "./useAIWorkspace";
import { AIQuickChat } from "./AIQuickChat";
import { AIPromptLauncher } from "./AIPromptLauncher";
import { AIQuickActions } from "./AIQuickActions";
import { AISuggestionsPanel } from "./AISuggestionsPanel";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { AIHistoryPanel } from "./AIHistoryPanel";
import { AIStatusIndicator } from "./AIStatusIndicator";
import { AITokenUsageWidget } from "./AITokenUsageWidget";

type DockTab = "chat" | "prompts" | "actions" | "suggestions" | "insights" | "history";

const DOCK_TABS: { id: DockTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
  { id: "chat",        label: "Chat",        icon: MessageSquare },
  { id: "prompts",     label: "Prompts",     icon: Library       },
  { id: "actions",     label: "Actions",     icon: Sparkles      },
  { id: "suggestions", label: "Suggest",     icon: Lightbulb     },
  { id: "insights",    label: "Insights",    icon: BarChart3     },
  { id: "history",     label: "History",     icon: History       },
];

interface AIAssistantDockProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantDock: React.FC<AIAssistantDockProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<DockTab>("chat");
  const {
    conversations, activeConversation, activeConvId,
    setActiveConvId, usage, isLoading,
    createConversation, sendMessage,
    pinConversation, favoriteConversation,
    deleteConversation, setFeedback,
  } = useAIWorkspace();

  const handleSend = (prompt: string) => {
    if (!activeConvId) {
      const id = createConversation(prompt);
      sendMessage(prompt, id);
    } else {
      sendMessage(prompt);
    }
  };

  const handleNewConversation = () => {
    const id = createConversation();
    setActiveConvId(id);
    setActiveTab("chat");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {}}
        aria-label="Open AI Assistant"
        className="flex flex-col items-center gap-1.5 py-3 px-2 bg-slate-900 border-l border-slate-800 text-slate-400 hover:text-white transition-colors"
      >
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span
          className="text-[9px] font-bold uppercase tracking-widest text-slate-600"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          AI
        </span>
      </button>
    );
  }

  return (
    <div
      className="flex flex-col bg-slate-900 border-l border-slate-800 overflow-hidden flex-shrink-0"
      style={{ width: 340 }}
      role="complementary"
      aria-label="AI Assistant Dock"
    >
      {/* ── Dock Header ─────────────────────────────────────────────────── */}
      <div className="h-10 flex-shrink-0 flex items-center justify-between px-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="text-xs font-bold text-white">AI Academic Assistant</span>
          <AIStatusIndicator compact />
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Close AI Dock"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Tab Strip ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-800 overflow-x-auto no-scrollbar bg-slate-900/60">
        {DOCK_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all flex-shrink-0 ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800"
              }`}
              title={tab.label}
              aria-label={tab.label}
              aria-pressed={isActive}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Active Tab Content ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" && (
          <AIQuickChat
            conversation={activeConversation}
            isLoading={isLoading}
            onSend={handleSend}
            onNew={handleNewConversation}
            onFeedback={(msgId, feedback) =>
              activeConvId && setFeedback(activeConvId, msgId, feedback)
            }
          />
        )}
        {activeTab === "prompts" && (
          <div className="h-full p-3 overflow-hidden">
            <AIPromptLauncher
              onSelect={(prompt) => {
                setActiveTab("chat");
                handleSend(prompt);
              }}
            />
          </div>
        )}
        {activeTab === "actions" && (
          <div className="p-3 overflow-y-auto h-full">
            <AIQuickActions
              onAction={(prompt) => {
                setActiveTab("chat");
                handleSend(prompt);
              }}
            />
          </div>
        )}
        {activeTab === "suggestions" && (
          <div className="p-3 overflow-y-auto h-full">
            <AISuggestionsPanel
              onSelect={(prompt) => {
                setActiveTab("chat");
                handleSend(prompt);
              }}
            />
          </div>
        )}
        {activeTab === "insights" && (
          <div className="p-3 overflow-y-auto h-full">
            <AIInsightsPanel />
          </div>
        )}
        {activeTab === "history" && (
          <div className="p-3 overflow-hidden h-full">
            <AIHistoryPanel
              conversations={conversations}
              activeConvId={activeConvId}
              onSelect={(id) => { setActiveConvId(id); setActiveTab("chat"); }}
              onPin={pinConversation}
              onFavorite={favoriteConversation}
              onDelete={deleteConversation}
              onNew={handleNewConversation}
            />
          </div>
        )}
      </div>

      {/* ── Dock Footer: Usage Widget ────────────────────────────────────── */}
      <div className="flex-shrink-0 p-3 border-t border-slate-800 space-y-2">
        <AITokenUsageWidget usage={usage} />
      </div>
    </div>
  );
};
