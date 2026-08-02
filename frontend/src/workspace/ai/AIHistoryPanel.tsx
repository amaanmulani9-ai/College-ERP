import React, { useState } from "react";
import { Search, Pin, Star, Trash2, MessageSquare, Clock } from "lucide-react";
import type { AIConversation } from "./useAIWorkspace";

interface AIHistoryPanelProps {
  conversations: AIConversation[];
  activeConvId: string | null;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

function timeAgo(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 60)    return `${d}s ago`;
  if (d < 3600)  return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export const AIHistoryPanel: React.FC<AIHistoryPanelProps> = ({
  conversations, activeConvId, onSelect, onPin, onFavorite, onDelete, onNew,
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pinned" | "favorites">("all");

  const filtered = conversations.filter((c) => {
    const matchQ   = !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "pinned" && c.isPinned) || (filter === "favorites" && c.isFavorite);
    return matchQ && matchFilter;
  });

  const pinned   = filtered.filter((c) => c.isPinned);
  const rest     = filtered.filter((c) => !c.isPinned);

  return (
    <div className="flex flex-col h-full space-y-2">
      {/* Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5">
        {(["all","pinned","favorites"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold capitalize transition-all ${filter === f ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"}`}>
            {f}
          </button>
        ))}
        <button onClick={onNew}
          className="ml-auto px-2.5 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all">
          + New
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {pinned.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-indigo-400 uppercase px-1 py-1 flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned</div>
            {pinned.map((c) => <ConvRow key={c.id} c={c} isActive={c.id === activeConvId} onSelect={onSelect} onPin={onPin} onFav={onFavorite} onDelete={onDelete} />)}
          </div>
        )}
        {rest.map((c) => <ConvRow key={c.id} c={c} isActive={c.id === activeConvId} onSelect={onSelect} onPin={onPin} onFav={onFavorite} onDelete={onDelete} />)}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-500">
            {conversations.length === 0 ? "No conversations yet. Start chatting!" : "No matching conversations."}
          </div>
        )}
      </div>
    </div>
  );
};

const ConvRow: React.FC<{
  c: AIConversation; isActive: boolean;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onFav: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ c, isActive, onSelect, onPin, onFav, onDelete }) => (
  <div
    onClick={() => onSelect(c.id)}
    className={`flex items-start gap-2 p-2.5 rounded-xl cursor-pointer group transition-all ${
      isActive ? "bg-indigo-600/20 border border-indigo-500/30" : "hover:bg-slate-800"
    }`}
  >
    <MessageSquare className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
    <div className="flex-1 min-w-0">
      <div className={`text-xs font-medium truncate ${isActive ? "text-white" : "text-slate-300"}`}>{c.title}</div>
      <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-0.5">
        <Clock className="w-2.5 h-2.5" />
        {timeAgo(c.updatedAt)} · {c.messages.length} msgs
      </div>
    </div>
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
      <button onClick={(e) => { e.stopPropagation(); onPin(c.id);    }} className={`p-1 rounded hover:bg-slate-700 ${c.isPinned    ? "text-indigo-400" : "text-slate-500"}`}><Pin  className="w-3 h-3" /></button>
      <button onClick={(e) => { e.stopPropagation(); onFav(c.id);    }} className={`p-1 rounded hover:bg-slate-700 ${c.isFavorite  ? "text-amber-400"  : "text-slate-500"}`}><Star className="w-3 h-3" /></button>
      <button onClick={(e) => { e.stopPropagation(); onDelete(c.id); }} className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
    </div>
  </div>
);
