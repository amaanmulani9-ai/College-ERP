import React, { useState } from "react";
import { MessageSquare, Star, Send, CheckCircle2 } from "lucide-react";

export const MobileFeedbackDialog: React.FC = () => {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<"bug" | "feature" | "general">("general");
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackText("");
    }, 2500);
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs select-none">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <MessageSquare className="w-4 h-4 text-indigo-400" />
        <h3 className="font-bold text-slate-100 text-xs">Mobile Feedback & Ratings</h3>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center space-y-1 text-emerald-300">
          <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
          <p className="font-bold text-xs">Feedback Submitted!</p>
          <p className="text-[10px] text-emerald-200/80">Thank you for helping us improve the mobile experience.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Rating */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="font-bold text-slate-200 text-[10px]">Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className={`p-1 ${s <= rating ? "text-amber-400" : "text-slate-600"}`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "general", label: "General" },
              { id: "bug",     label: "Bug Report" },
              { id: "feature", label: "Feature Idea" },
            ].map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setCategory(c.id as any)}
                className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                  category === c.id ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Feedback Textarea */}
          <textarea
            rows={3}
            placeholder="Share your thoughts or describe an issue…"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!feedbackText.trim()}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Mobile Feedback</span>
          </button>
        </form>
      )}
    </div>
  );
};
