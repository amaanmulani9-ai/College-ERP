import React, { useState } from "react";
import { X, BookOpen, Search, ChevronDown, ChevronRight } from "lucide-react";

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
}

const HELP_ARTICLES: HelpArticle[] = [
  { id: "h01", category: "Getting Started", title: "How to set up your institution profile", content: "Navigate to Settings → Institution → Institution Profile. Fill in your institution name, upload a logo (square, min 256×256 px), and enter a valid contact email and phone. Click Save to publish changes across all portals." },
  { id: "h02", category: "Getting Started", title: "Creating your first academic session", content: "Go to Settings → Institution → Academic Session. Click 'Add Session', enter the year (e.g. 2026-27), set start and end dates, and mark it as the Active session. All enrollment and grade records will be linked to this session." },
  { id: "h03", category: "Users & Roles", title: "How to create and assign roles", content: "Navigate to Settings → Security → Role Management. Click 'New Role', enter a role name and description, then assign module-level permissions using the RBAC Matrix. Finally, assign the role to users in User Management." },
  { id: "h04", category: "Users & Roles", title: "Enabling Multi-Factor Authentication", content: "Go to Settings → Security → MFA Settings. Enable TOTP (Google Authenticator) or Email OTP. You can enforce MFA globally for all users or only for specific roles like Super Admin and Finance Officer." },
  { id: "h05", category: "Platform", title: "Configuring Razorpay payment gateway", content: "Visit Settings → Platform → Payment Gateways. Select Razorpay and enter your live API Key ID and Secret Key. Set Webhook URL to your domain /webhooks/razorpay. Toggle Sandbox → Production and click Save & Verify." },
  { id: "h06", category: "Platform", title: "Setting up email delivery via SMTP", content: "Go to Settings → Platform → SMTP / Email. Enter your SMTP host, port (587 for TLS), credentials, and sender name. Click 'Send Test Email' to verify delivery before saving." },
  { id: "h07", category: "System", title: "Understanding system health indicators", content: "The System Health dashboard shows real-time status for all platform services. Green = Healthy, Amber (pulsing) = Degraded, Red (pulsing) = Critical, Grey = Maintenance. Latency above 200ms is flagged in amber automatically." },
  { id: "h08", category: "System", title: "How to trigger a manual database backup", content: "Navigate to Settings → System → Backup & Recovery. Click 'Trigger Manual Backup'. The system runs an incremental backup of all databases. You'll see the job appear in the history list with live status updates." },
];

const CATEGORIES = [...new Set(HELP_ARTICLES.map((a) => a.category))];

interface SettingsHelpCenterProps {
  onClose: () => void;
}

export const SettingsHelpCenter: React.FC<SettingsHelpCenterProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = HELP_ARTICLES.filter((a) => {
    const matchQuery = a.title.toLowerCase().includes(query.toLowerCase()) || a.content.toLowerCase().includes(query.toLowerCase());
    const matchCategory = activeCategory === "All" || a.category === activeCategory;
    return matchQuery && matchCategory;
  });

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">Settings Help Center & Documentation</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search help articles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-600"
              autoFocus
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800 overflow-x-auto shrink-0">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                activeCategory === cat ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.map((article) => (
            <div key={article.id} className="border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenId(openId === article.id ? null : article.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-950 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded uppercase">{article.category}</span>
                  <span className="text-sm font-semibold text-slate-100">{article.title}</span>
                </div>
                {openId === article.id ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openId === article.id && (
                <div className="p-4 bg-slate-950/50 border-t border-slate-800 text-sm text-slate-300 leading-relaxed">
                  {article.content}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-slate-400">No articles found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
