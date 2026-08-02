import React from "react";
import { Pin, Star, MessageSquare, Clock } from "lucide-react";
import type { AIConversation } from "./useAIWorkspace";

interface AIConversationSidebarProps {
  conversations: AIConversation[];
  activeConvId: string | null;
  onSelect: (id: string) => void;
}

function timeAgo(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 60)    return `${d}s ago`;
  if (d < 3600)  return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export const AIConversationSidebar: React.FC<AIConversationSidebarProps> = ({
  conversations, activeConvId, onSelect,
}) => {
  const pinned    = conversations.filter((c) => c.isPinned);
  const favorites = conversations.filter((c) => c.isFavorite && !c.isPinned);
  const recent    = conversations.filter((c) => !c.isPinned && !c.isFavorite).slice(0, 8);

  const Section = ({
    title, items, icon: Icon, iconColor,
  }: { title: string; items: AIConversation[]; icon: React.FC<{ className?: string }>; iconColor: string }) => {
    if (items.length === 0) return null;
    return (
      <div>
        <div className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${iconColor}`}>
          <Icon className="w-3 h-3" /> {title}
        </div>
        {items.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left group transition-all ${
              c.id === activeConvId
                ? "bg-indigo-600/20 text-indigo-300"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{c.title}</div>
              <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-0.5">
                <Clock className="w-2.5 h-2.5" />
                {timeAgo(c.updatedAt)}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-1 py-2">
      <Section title="Pinned"    items={pinned}    icon={Pin}     iconColor="text-indigo-400" />
      <Section title="Favorites" items={favorites} icon={Star}    iconColor="text-amber-400"  />
      <Section title="Recent"    items={recent}    icon={Clock}   iconColor="text-slate-500"  />
      {conversations.length === 0 && (
        <div className="py-8 text-center text-xs text-slate-600">No conversations yet.</div>
      )}
    </div>
  );
};
