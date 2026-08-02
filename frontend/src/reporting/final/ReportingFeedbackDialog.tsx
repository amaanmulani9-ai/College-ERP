import React, { useState } from "react";
import { MessageSquare, Star, Send, X, CheckCircle2 } from "lucide-react";

interface ReportingFeedbackDialogProps {
  onClose: () => void;
}

export const ReportingFeedbackDialog: React.FC<ReportingFeedbackDialogProps> = ({ onClose }) => {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState("Feature Request");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-xs font-sans space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">Submit Platform Feedback</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 bg-slate-950 border border-emerald-800 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-100">Thank You For Your Feedback!</h3>
            <p className="text-xs text-slate-400">
              Your feedback has been logged to help improve the College ERP Reporting Platform.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Rate Your Platform Experience
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 transition-transform hover:scale-110"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? "fill-amber-400" : "text-slate-600"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Feature Request">Feature Request</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Visual Improvement">Visual / UI Improvement</option>
                <option value="General Feedback">General Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Comments & Suggestions
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on how to make reporting even better..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
