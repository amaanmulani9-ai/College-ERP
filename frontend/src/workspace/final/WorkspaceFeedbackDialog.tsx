import React, { useState } from "react";
import { MessageSquarePlus, Bug, Lightbulb, Star, X, Send, CheckCircle2 } from "lucide-react";

type FeedbackType = "bug" | "feature" | "general";

interface WorkspaceFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceFeedbackDialog: React.FC<WorkspaceFeedbackDialogProps> = ({
  isOpen, onClose,
}) => {
  const [type,        setType]        = useState<FeedbackType>("general");
  const [rating,      setRating]      = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [body,        setBody]        = useState("");
  const [email,       setEmail]       = useState("");
  const [submitted,   setSubmitted]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder submission — connect to backend TASK-030 AI or support endpoint
    console.log("[Feedback]", { type, rating, body, email });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setBody(""); setRating(0); onClose(); }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Send Feedback" className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <MessageSquarePlus className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white flex-1">Send Feedback</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" aria-label="Close feedback dialog">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="text-base font-bold text-white">Thank you!</div>
              <div className="text-sm text-slate-400 mt-1">Your feedback has been recorded.</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Type selector */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Feedback Type</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: "general" as FeedbackType, label: "General",    icon: MessageSquarePlus },
                  { id: "bug"     as FeedbackType, label: "Bug Report",  icon: Bug              },
                  { id: "feature" as FeedbackType, label: "Feature Req", icon: Lightbulb        },
                ] as { id: FeedbackType; label: string; icon: React.FC<{ className?: string }> }[]).map(({ id, label, icon: Icon }) => (
                  <button type="button" key={id} onClick={() => setType(id)}
                    aria-pressed={type === id}
                    className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                      type === id ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Star rating */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Overall Rating</label>
              <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                {[1,2,3,4,5].map((n) => (
                  <button type="button" key={n}
                    role="radio" aria-checked={rating === n} aria-label={`${n} star${n>1?"s":""}`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star className={`w-7 h-7 transition-colors ${
                      n <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-slate-700"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div>
              <label htmlFor="feedback-body" className="text-xs font-bold text-slate-400 block mb-2">
                {type === "bug" ? "Describe the issue" : type === "feature" ? "Describe your idea" : "Your feedback"}
              </label>
              <textarea
                id="feedback-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={4}
                placeholder={type === "bug" ? "Steps to reproduce…" : type === "feature" ? "I wish the workspace could…" : "Share your thoughts…"}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="feedback-email" className="text-xs font-bold text-slate-400 block mb-2">Email <span className="font-normal text-slate-600">(optional)</span></label>
              <input id="feedback-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Screenshot placeholder */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 border-dashed text-xs text-slate-500 cursor-not-allowed">
              📎 Attach screenshot <span className="text-slate-600">(Phase 6+ placeholder)</span>
            </div>

            {/* Submit */}
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20">
              <Send className="w-4 h-4" />
              Send Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
