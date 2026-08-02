import React, { useState } from "react";
import {
  Sparkles, PanelLeft, BarChart3, MapPin,
  Cpu, Wifi, Database,
} from "lucide-react";
import { useAIWorkspace } from "./useAIWorkspace";
import { AIQuickChat } from "./AIQuickChat";
import { AIConversationSidebar } from "./AIConversationSidebar";
import { AIPromptLauncher } from "./AIPromptLauncher";
import { AIQuickActions } from "./AIQuickActions";
import { AISuggestionsPanel } from "./AISuggestionsPanel";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { AIHistoryPanel } from "./AIHistoryPanel";
import { AIContextPanel } from "./AIContextPanel";
import { AIStatusIndicator } from "./AIStatusIndicator";
import { AITokenUsageWidget } from "./AITokenUsageWidget";

type RightPanelTab = "prompts" | "actions" | "suggestions" | "insights" | "context" | "history";

const RIGHT_TABS: { id: RightPanelTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "prompts",     label: "Prompts",     icon: Sparkles  },
  { id: "actions",     label: "Actions",     icon: Cpu       },
  { id: "suggestions", label: "Suggest",     icon: BarChart3 },
  { id: "insights",    label: "Insights",    icon: BarChart3 },
  { id: "context",     label: "Context",     icon: MapPin    },
  { id: "history",     label: "History",     icon: Database  },
];

export const AIWorkspacePanel: React.FC = () => {
  const {
    conversations, activeConversation, activeConvId,
    setActiveConvId, usage, isLoading, context,
    createConversation, sendMessage,
    pinConversation, favoriteConversation,
    deleteConversation, setFeedback,
  } = useAIWorkspace();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightTab, setRightTab] = useState<RightPanelTab>("prompts");

  const handleSend = (prompt: string) => {
    if (!activeConvId) {
      const id = createConversation(prompt);
      sendMessage(prompt, id);
    } else {
      sendMessage(prompt);
    }
  };

  const handleNew = () => {
    const id = createConversation();
    setActiveConvId(id);
  };

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden">
      {/* ── Left: Conversation Sidebar ────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="w-60 flex-shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
          <div className="h-10 flex-shrink-0 flex items-center justify-between px-3 border-b border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conversations</span>
            <button
              onClick={handleNew}
              className="px-2 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-all"
            >
              + New
            </button>
          </div>
          <div className="flex-1 overflow-hidden px-2 py-2">
            <AIConversationSidebar
              conversations={conversations}
              activeConvId={activeConvId}
              onSelect={setActiveConvId}
            />
          </div>
        </div>
      )}

      {/* ── Center: Chat ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat header */}
        <div className="h-10 flex-shrink-0 flex items-center gap-3 px-4 border-b border-slate-800 bg-slate-900/60">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${sidebarOpen ? "text-indigo-400" : "text-slate-500"}`}
            title="Toggle conversation sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span className="text-sm font-bold text-white truncate">
              {activeConversation?.title ?? "AI Academic Assistant"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <AIStatusIndicator compact />
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <Wifi className="w-3 h-3 text-emerald-400" />
              {usage.model}
            </div>
          </div>
        </div>

        {/* Chat body */}
        <div className="flex-1 overflow-hidden">
          <AIQuickChat
            conversation={activeConversation}
            isLoading={isLoading}
            onSend={handleSend}
            onNew={handleNew}
            onFeedback={(msgId, feedback) =>
              activeConvId && setFeedback(activeConvId, msgId, feedback)
            }
          />
        </div>
      </div>

      {/* ── Right: Tools Panel ──────────────────────────────────────────── */}
      <div className="w-72 flex-shrink-0 border-l border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
        {/* Right panel tab strip */}
        <div className="h-10 flex-shrink-0 flex items-center gap-0.5 px-2 border-b border-slate-800 overflow-x-auto no-scrollbar">
          {RIGHT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = rightTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setRightTab(tab.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  isActive ? "bg-indigo-600/20 text-indigo-400" : "text-slate-500 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right panel content */}
        <div className="flex-1 overflow-y-auto p-3">
          {rightTab === "prompts" && (
            <AIPromptLauncher onSelect={(p) => { handleSend(p); }} />
          )}
          {rightTab === "actions" && (
            <AIQuickActions onAction={(p) => { handleSend(p); }} />
          )}
          {rightTab === "suggestions" && (
            <AISuggestionsPanel onSelect={(p) => { handleSend(p); }} />
          )}
          {rightTab === "insights" && <AIInsightsPanel />}
          {rightTab === "context" && (
            <div className="space-y-3">
              <AIContextPanel context={context} />
              <AIStatusIndicator />
            </div>
          )}
          {rightTab === "history" && (
            <AIHistoryPanel
              conversations={conversations}
              activeConvId={activeConvId}
              onSelect={setActiveConvId}
              onPin={pinConversation}
              onFavorite={favoriteConversation}
              onDelete={deleteConversation}
              onNew={handleNew}
            />
          )}
        </div>

        {/* Footer usage */}
        <div className="flex-shrink-0 p-3 border-t border-slate-800">
          <AITokenUsageWidget usage={usage} />
        </div>
      </div>
    </div>
  );
};
