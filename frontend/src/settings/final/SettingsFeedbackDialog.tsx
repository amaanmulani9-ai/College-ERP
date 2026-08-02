import React, { useState } from "react";
import { X, MessageSquare, Star, Bug, Lightbulb } from "lucide-react";

type FeedbackType = "bug" | "feature" | "general";

interface SettingsFeedbackDialogProps {
  onClose: () => void;
}

const TYPE_CONFIG = {
  bug:     { label: "Bug Report",       icon: Bug,           placeholder: "Describe what happened, what you expected, and steps to reproduce…" },
  feature: { label: "Feature Request",  icon: Lightbulb,     placeholder: "Describe the feature you'd like and the problem it solves…" },
  general: { label: "General Feedback", icon: MessageSquare, placeholder: "Share any thoughts, impressions or suggestions about the Settings…" },
} as const;

export const SettingsFeedbackDialog: React.FC<SettingsFeedbackDialogProps> = ({ onClose }) => {
  const [type, setType]        = useState<FeedbackType>("general");
  const [rating, setRating]    = useState(0);
  const [hovered, setHovered]  = useState(0);
  const [message, setMessage]  = useState("");
  const [email, setEmail]      = useState("");
  const [submitted, setSubmit] = useState(false);

  const cfg = TYPE_CONFIG[type];

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog" aria-modal="true" aria-label="Feedback dialog">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-xs font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-100">Send Feedback</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center p-10 text-center gap-4">
            <span className="text-5xl">🙏</span>
            <h3 className="text-base font-bold text-slate-100">Thank you for your feedback!</h3>
            <p className="text-[11px] text-slate-400">Your {cfg.label.toLowerCase()} has been submitted. We'll review it shortly.</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-[11px]">Done</button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(TYPE_CONFIG) as FeedbackType[]).map((t) => {
                const tc = TYPE_CONFIG[t];
                const Icon = tc.icon;
                return (
                  <button key={t} onClick={() => setType(t)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${type === t ? "bg-indigo-600/20 border-indigo-600 text-indigo-300" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"}`}>
                    <Icon className={`w-4 h-4 ${type === t ? "text-indigo-400" : "text-slate-500"}`} />
                    <span className="text-[10px] font-bold text-center leading-tight">{tc.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Star Rating */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Overall Rating (optional)</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s}
                    onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(s)} aria-label={`Rate ${s} stars`}
                    className="transition-transform hover:scale-110">
                    <Star className={`w-6 h-6 transition-colors ${s <= (hovered || rating) ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
                  </button>
                ))}
                {rating > 0 && <span className="text-[10px] text-amber-400 ml-2 font-bold">{["","Poor","Fair","Good","Great","Excellent"][rating]}</span>}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">{cfg.label} *</label>
              <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder={cfg.placeholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-600 resize-none" />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Email (optional — for follow-up)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-600" />
            </div>

            {/* Screenshot placeholder */}
            <div className="flex items-center gap-3 p-3 bg-slate-950 border-2 border-dashed border-slate-700 rounded-xl text-[10px] text-slate-500">
              <span>📎</span>
              <span>Attach screenshot (placeholder — file upload coming in v0.35)</span>
            </div>

            <button onClick={() => { if (message.trim()) setSubmit(true); }} disabled={!message.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-[11px]">
              Submit {cfg.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
