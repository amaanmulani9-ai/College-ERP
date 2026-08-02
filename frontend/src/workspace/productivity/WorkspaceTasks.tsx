import React, { useState, useEffect } from "react";
import {
  Plus, CheckCircle2, Circle, Flag, Trash2, Search,
  Pin, ChevronDown, ChevronRight, AlertTriangle,
} from "lucide-react";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface WorkspaceTask {
  id: string;
  title: string;
  priority: TaskPriority;
  completed: boolean;
  dueDate?: string;
  isPinned: boolean;
  createdAt: number;
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low:    "text-slate-400 bg-slate-800",
  medium: "text-sky-400    bg-sky-900/30",
  high:   "text-amber-400  bg-amber-900/30",
  urgent: "text-rose-400   bg-rose-900/30",
};

const STORAGE_KEY = "college_erp_workspace_tasks";

const defaultTasks: WorkspaceTask[] = [
  { id: "t1", title: "Review pending fee dues for Semester 3", priority: "high",   completed: false, isPinned: true,  createdAt: Date.now() - 3600000 },
  { id: "t2", title: "Update exam schedule for CSE department",   priority: "urgent", completed: false, isPinned: false, createdAt: Date.now() - 7200000 },
  { id: "t3", title: "Approve hostel allotment requests",         priority: "medium", completed: false, isPinned: false, createdAt: Date.now() - 10800000 },
  { id: "t4", title: "Send AI assistant usage report to faculty", priority: "low",    completed: true,  isPinned: false, createdAt: Date.now() - 86400000 },
];

export const WorkspaceTasks: React.FC = () => {
  const [tasks, setTasks] = useState<WorkspaceTask[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultTasks;
    } catch { return defaultTasks; }
  });
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch { /* silent */ }
  }, [tasks]);

  const addTask = () => {
    if (!newTitle.trim()) return;
    const task: WorkspaceTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      priority: newPriority,
      completed: false,
      dueDate: newDueDate || undefined,
      isPinned: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
    setNewTitle(""); setNewDueDate(""); setNewPriority("medium"); setShowAddForm(false);
  };

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  const pin = (id: string) =>
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, isPinned: !t.isPinned } : t));
  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const q = search.toLowerCase();
  const filtered = tasks.filter((t) => !q || t.title.toLowerCase().includes(q));
  const pinned = filtered.filter((t) => t.isPinned && !t.completed);
  const active = filtered.filter((t) => !t.isPinned && !t.completed);
  const completed = filtered.filter((t) => t.completed);

  const TaskRow = ({ task }: { task: WorkspaceTask }) => (
    <div className={`flex items-start gap-2 p-2.5 rounded-xl group transition-all ${task.isPinned ? "bg-indigo-950/30 border border-indigo-800/30" : "hover:bg-slate-800/60"}`}>
      <button onClick={() => toggle(task.id)} className="mt-0.5 flex-shrink-0 transition-colors">
        {task.completed
          ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          : <Circle className="w-4 h-4 text-slate-600 hover:text-indigo-400" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium leading-snug ${task.completed ? "line-through text-slate-500" : "text-slate-200"}`}>{task.title}</p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="text-[10px] text-slate-500 font-mono">{task.dueDate}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button onClick={() => pin(task.id)} className={`p-1 rounded hover:bg-slate-700 transition-colors ${task.isPinned ? "text-indigo-400" : "text-slate-500 hover:text-slate-200"}`} title="Pin">
          <Pin className="w-3 h-3" />
        </button>
        <button onClick={() => remove(task.id)} className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors" title="Delete">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Search + Add */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..." className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title..." autoFocus
            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            onKeyDown={(e) => e.key === "Enter" && addTask()} />
          <div className="flex gap-2">
            <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none">
              {(["low","medium","high","urgent"] as TaskPriority[]).map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>
              ))}
            </select>
            <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={addTask}
              className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all">
              Add Task
            </button>
            <button onClick={() => setShowAddForm(false)}
              className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {pinned.length > 0 && (
          <div className="mb-1">
            <div className="px-1 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Pin className="w-3 h-3" /> Pinned
            </div>
            {pinned.map((t) => <TaskRow key={t.id} task={t} />)}
          </div>
        )}
        {active.map((t) => <TaskRow key={t.id} task={t} />)}
        {active.length === 0 && pinned.length === 0 && !search && (
          <div className="py-8 text-center text-xs text-slate-500">No active tasks. Press + to add one.</div>
        )}

        {/* Completed section */}
        {completed.length > 0 && (
          <div className="pt-2 border-t border-slate-800/60">
            <button onClick={() => setShowCompleted(!showCompleted)}
              className="w-full flex items-center gap-2 px-1 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors">
              {showCompleted ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              Completed ({completed.length})
            </button>
            {showCompleted && completed.map((t) => <TaskRow key={t.id} task={t} />)}
          </div>
        )}
      </div>
    </div>
  );
};
