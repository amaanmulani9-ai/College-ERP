import React, { useState } from "react";
import { Copy, Check, Info, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Button } from "../Button";
import { StatusBadge } from "../data/Status";

// ─── Tooltip ───────────────────────────────────────────────────────────────
export interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-white text-[11px] font-semibold rounded-lg shadow-xl z-50 whitespace-nowrap pointer-events-none">
          {content}
        </div>
      )}
    </div>
  );
};

// ─── Popover & HoverCard ───────────────────────────────────────────────────
export const Popover: React.FC<{ trigger: React.ReactNode; children: React.ReactNode }> = ({
  trigger,
  children,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute top-full right-0 mt-2 p-4 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 min-w-[200px]">
          {children}
        </div>
      )}
    </div>
  );
};

export const HoverCard = Popover;

// ─── CopyButton & Clipboard ────────────────────────────────────────────────
export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="xs"
      leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      onClick={handleCopy}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
};

export const Clipboard = CopyButton;

// ─── CodeBlock / JSONViewer / MarkdownViewer ──────────────────────────────
export const CodeBlock: React.FC<{ code: string; language?: string }> = ({
  code,
  language = "json",
}) => (
  <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-indigo-300 overflow-x-auto">
    <div className="absolute right-3 top-3">
      <CopyButton text={code} />
    </div>
    <span className="text-[10px] text-slate-600 block mb-2 uppercase">{language}</span>
    <pre><code>{code}</code></pre>
  </div>
);

export const JSONViewer: React.FC<{ data: unknown }> = ({ data }) => (
  <CodeBlock code={JSON.stringify(data, null, 2)} language="json" />
);

export const MarkdownViewer: React.FC<{ content: string }> = ({ content }) => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed font-sans">
    {content}
  </div>
);

// ─── Advanced: MetricComparisonCard ───────────────────────────────────────
export interface MetricComparisonProps {
  title: string;
  currentValue: string | number;
  previousValue: string | number;
  change: string;
  isPositive?: boolean;
}

export const MetricComparisonCard: React.FC<MetricComparisonProps> = ({
  title,
  currentValue,
  previousValue,
  change,
  isPositive = true,
}) => (
  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
    <span className="text-xs font-semibold text-slate-400">{title}</span>
    <div className="flex items-baseline justify-between">
      <span className="text-2xl font-extrabold text-white">{currentValue}</span>
      <span className={`flex items-center gap-1 text-xs font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {change}
      </span>
    </div>
    <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-500 flex items-center justify-between">
      <span>Previous Period:</span>
      <span className="font-mono font-bold text-slate-300">{previousValue}</span>
    </div>
  </div>
);

export const StatisticGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
);

// ─── Advanced: FeatureComparisonTable ──────────────────────────────────────
export interface FeatureRow {
  feature: string;
  basic: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

export const FeatureComparisonTable: React.FC<{ rows: FeatureRow[] }> = ({ rows }) => (
  <div className="w-full overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950">
    <table className="w-full text-left text-xs">
      <thead className="bg-slate-900 text-slate-400 font-mono border-b border-slate-800">
        <tr>
          <th className="p-4">Feature</th>
          <th className="p-4 text-center">Starter</th>
          <th className="p-4 text-center">Pro</th>
          <th className="p-4 text-center font-bold text-indigo-400">Enterprise</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-900 text-slate-200">
        {rows.map((row, idx) => (
          <tr key={idx} className="hover:bg-slate-900/50">
            <td className="p-4 font-semibold text-white">{row.feature}</td>
            <td className="p-4 text-center">{String(row.basic)}</td>
            <td className="p-4 text-center">{String(row.pro)}</td>
            <td className="p-4 text-center font-bold text-indigo-300">{String(row.enterprise)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const TimelineCard = MetricComparisonCard;
export const AuditLogViewer = JSONViewer;
export const ActivityTimeline = JSONViewer;
