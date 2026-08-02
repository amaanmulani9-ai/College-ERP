import React, { useState, useEffect } from "react";
import { Plus, Pin, Archive, Trash2, Search, X } from "lucide-react";

export interface WorkspaceNote {
  id: string;
  title: string;
  body: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  updatedAt: number;
}

const NOTE_COLORS = [
  "bg-slate-900 border-slate-700",
  "bg-indigo-950/50 border-indigo-800/50",
  "bg-amber-950/40 border-amber-800/40",
  "bg-emerald-950/40 border-emerald-800/40",
  "bg-rose-950/40 border-rose-800/40",
  "bg-purple-950/40 border-purple-800/40",
];

const COLOR_DOTS = [
  "bg-slate-600", "bg-indigo-500", "bg-amber-500",
  "bg-emerald-500", "bg-rose-500", "bg-purple-500",
];

const STORAGE_KEY = "college_erp_workspace_notes";

const defaultNotes: WorkspaceNote[] = [
  { id: "n1", title: "AI Assistant Notes", body: "Placeholder providers: OpenAI, Gemini, Ollama, Azure — plug in later. Keep provider-agnostic interface.", color: NOTE_COLORS[1], isPinned: true, isArchived: false, updatedAt: Date.now() - 3600000 },
  { id: "n2", title: "Exam Schedule Reminders", body: "Mid-semester exams start next week. Ensure timetable is approved and hall tickets issued.", color: NOTE_COLORS[2], isPinned: false, isArchived: false, updatedAt: Date.now() - 7200000 },
];

export const WorkspaceNotes: React.FC = () => {
  const [notes, setNotes] = useState<WorkspaceNote[]>(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : defaultNotes; } catch { return defaultNotes; }
  });
  const [search, setSearch] = useState("");
  const [activeNote, setActiveNote] = useState<WorkspaceNote | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editTitle, setEditTitle] = useState("");

  // Autosave on edit change
  useEffect(() => {
    if (!activeNote) return;
    const timer = setTimeout(() => {
      setNotes((prev) => prev.map((n) => n.id === activeNote.id ? { ...n, title: editTitle, body: editBody, updatedAt: Date.now() } : n));
    }, 600);
    return () => clearTimeout(timer);
  }, [editTitle, editBody, activeNote]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { /* silent */ }
  }, [notes]);

  const openNote = (note: WorkspaceNote) => { setActiveNote(note); setEditTitle(note.title); setEditBody(note.body); };
  const closeNote = () => setActiveNote(null);
  const addNote = () => {
    const newNote: WorkspaceNote = { id: `note-${Date.now()}`, title: "Untitled Note", body: "", color: NOTE_COLORS[0], isPinned: false, isArchived: false, updatedAt: Date.now() };
    setNotes((prev) => [newNote, ...prev]);
    openNote(newNote);
  };
  const pin = (id: string) => setNotes((prev) => prev.map((n) => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  const archive = (id: string) => { setNotes((prev) => prev.map((n) => n.id === id ? { ...n, isArchived: !n.isArchived } : n)); if (activeNote?.id === id) closeNote(); };
  const remove = (id: string) => { setNotes((prev) => prev.filter((n) => n.id !== id)); if (activeNote?.id === id) closeNote(); };
  const setColor = (id: string, color: string) => setNotes((prev) => prev.map((n) => n.id === id ? { ...n, color } : n));

  const q = search.toLowerCase();
  const visible = notes.filter((n) => !n.isArchived && (!q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)));
  const pinned = visible.filter((n) => n.isPinned);
  const rest = visible.filter((n) => !n.isPinned);

  if (activeNote) {
    return (
      <div className={`flex flex-col h-full rounded-2xl border overflow-hidden ${activeNote.color}`}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="flex-1 bg-transparent text-xs font-bold text-white focus:outline-none placeholder-slate-500" placeholder="Note title..." />
          <div className="flex items-center gap-1">
            {/* Color picker */}
            {NOTE_COLORS.map((c, i) => (
              <button key={i} onClick={() => { setColor(activeNote.id, c); setActiveNote({ ...activeNote, color: c }); }}
                className={`w-3 h-3 rounded-full ${COLOR_DOTS[i]} border-2 ${activeNote.color === c ? "border-white" : "border-transparent"}`} />
            ))}
            <button onClick={closeNote} className="ml-2 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"><X className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)}
          placeholder="Start writing your note... (autosaved)"
          className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-600 p-3 resize-none focus:outline-none leading-relaxed" />
        <div className="px-3 py-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-600">Autosaved</span>
          <div className="flex gap-1">
            <button onClick={() => pin(activeNote.id)} className={`p-1 rounded hover:bg-slate-800 transition-colors ${activeNote.isPinned ? "text-indigo-400" : "text-slate-500 hover:text-slate-200"}`}><Pin className="w-3.5 h-3.5" /></button>
            <button onClick={() => archive(activeNote.id)} className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-200"><Archive className="w-3.5 h-3.5" /></button>
            <button onClick={() => remove(activeNote.id)} className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
        </div>
        <button onClick={addNote} className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"><Plus className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {pinned.length > 0 && (
          <div>
            <div className="px-1 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1 mb-1"><Pin className="w-3 h-3" /> Pinned</div>
            {pinned.map((note) => <NoteCard key={note.id} note={note} onOpen={openNote} onPin={pin} onArchive={archive} onDelete={remove} />)}
          </div>
        )}
        {rest.map((note) => <NoteCard key={note.id} note={note} onOpen={openNote} onPin={pin} onArchive={archive} onDelete={remove} />)}
        {visible.length === 0 && <div className="py-8 text-center text-xs text-slate-500">No notes yet. Press + to create one.</div>}
      </div>
    </div>
  );
};

const NoteCard: React.FC<{ note: WorkspaceNote; onOpen: (n: WorkspaceNote) => void; onPin: (id: string) => void; onArchive: (id: string) => void; onDelete: (id: string) => void }> = ({ note, onOpen, onPin, onArchive, onDelete }) => (
  <div onClick={() => onOpen(note)} className={`p-3 rounded-xl border cursor-pointer group transition-all hover:scale-[1.01] ${note.color}`}>
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-white truncate">{note.title}</div>
        {note.body && <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{note.body}</p>}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onPin(note.id)} className={`p-1 rounded hover:bg-slate-800 ${note.isPinned ? "text-indigo-400" : "text-slate-500"}`}><Pin className="w-3 h-3" /></button>
        <button onClick={() => onDelete(note.id)} className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
      </div>
    </div>
    <div className="mt-2 text-[10px] text-slate-600">{new Date(note.updatedAt).toLocaleDateString()}</div>
  </div>
);
