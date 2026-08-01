import React, { useState, useEffect } from "react";
import { StickyNote, Plus, Trash2, Save } from "lucide-react";

interface Note {
  id: string;
  text: string;
  color: string;
  createdAt: string;
}

const NOTE_COLORS = ["bg-indigo-950 border-indigo-800", "bg-amber-950 border-amber-800", "bg-emerald-950 border-emerald-800", "bg-purple-950 border-purple-800"];

export const QuickNotesWidget: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("dashboard_quick_notes") || "[]");
    } catch {
      return [];
    }
  });
  const [newNote, setNewNote] = useState("");
  const [colorIdx, setColorIdx] = useState(0);

  useEffect(() => {
    localStorage.setItem("dashboard_quick_notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newNote.trim(), color: NOTE_COLORS[colorIdx], createdAt: new Date().toLocaleDateString() },
    ]);
    setNewNote("");
    setColorIdx((i) => (i + 1) % NOTE_COLORS.length);
  };

  const deleteNote = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-lg space-y-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <StickyNote className="w-4 h-4 text-amber-400" /> Quick Notes
      </h3>

      {/* Add Note Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Add a quick note... (Enter to save)"
          className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={addNote}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Notes */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No notes yet. Add your first note above.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className={`p-3 rounded-2xl border flex items-start justify-between gap-2 ${note.color}`}>
              <p className="text-xs text-slate-200 flex-1 leading-relaxed">{note.text}</p>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
