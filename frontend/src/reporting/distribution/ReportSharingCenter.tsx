import React, { useState } from "react";
import { Share2, Copy, Eye, Lock, Globe, Check, Link } from "lucide-react";
import { ShareLinkItem } from "./types";
import { MOCK_SHARE_LINKS } from "./mockDistributionData";

export const ReportSharingCenter: React.FC = () => {
  const [links, setLinks] = useState<ShareLinkItem[]>(MOCK_SHARE_LINKS);
  const [reportTitle, setReportTitle] = useState("Academic & Pass Percentage Master Report");
  const [privacy, setPrivacy] = useState<"public" | "private">("private");
  const [accessLevel, setAccessLevel] = useState<"read-only" | "editable">("read-only");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateLink = () => {
    const newLink: ShareLinkItem = {
      id: `share-${Date.now()}`,
      reportTitle,
      reportId: `rep-${Date.now()}`,
      shareUrl: `https://erp.college.edu/share/${reportTitle.toLowerCase().replace(/ /g, "-")}-${Date.now().toString(36)}`,
      accessLevel,
      privacy,
      expiresAt: "2026-12-31",
      sharedWithRole: privacy === "public" ? "All Users" : "Restricted Role Access",
      viewCount: 0,
    };
    setLinks([newLink, ...links]);
  };

  const copyToClipboard = (link: ShareLinkItem) => {
    navigator.clipboard.writeText(link.shareUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
          <Share2 className="w-5 h-5 text-indigo-400" />
          <span>Enterprise Report Sharing & Security Portal</span>
        </h2>
        <p className="text-slate-400">
          Generate secure shareable links, set role permissions, and control expiration dates.
        </p>
      </div>

      {/* Generate Share Link Form */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
          Create New Secure Report Link
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Select Report Title to Share
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Access Privacy Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPrivacy("private")}
                className={`flex items-center justify-center gap-1 py-2 rounded-lg border font-mono ${
                  privacy === "private"
                    ? "bg-indigo-600 border-indigo-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Private</span>
              </button>
              <button
                onClick={() => setPrivacy("public")}
                className={`flex items-center justify-center gap-1 py-2 rounded-lg border font-mono ${
                  privacy === "public"
                    ? "bg-indigo-600 border-indigo-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Public</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerateLink}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md transition-colors"
          >
            <Link className="w-4 h-4" />
            <span>Generate Shared Link</span>
          </button>
        </div>
      </div>

      {/* Active Share Links Table */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
          Active Shared Report Links ({links.length})
        </h3>

        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between font-mono"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                      link.privacy === "public"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-indigo-950 text-indigo-300 border border-indigo-800"
                    }`}
                  >
                    {link.privacy}
                  </span>
                  <h4 className="font-bold text-slate-200 font-sans">{link.reportTitle}</h4>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-lg">{link.shareUrl}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {link.viewCount} views
                </span>

                <button
                  onClick={() => copyToClipboard(link)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors font-sans"
                >
                  {copiedId === link.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
