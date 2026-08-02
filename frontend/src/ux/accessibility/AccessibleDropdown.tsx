import React, { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { ACCESSIBILITY_TOKENS } from "./accessibilityTokens";

export const AccessibleDropdown: React.FC<{
  label: string;
  items: { label: string; onClick: () => void }[];
}> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left font-sans text-xs select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-bold flex items-center gap-1.5 ${ACCESSIBILITY_TOKENS.focusRing.standard}`}
      >
        <span>{label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-1 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              role="menuitem"
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-[11px] font-medium transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const AccessibleTooltip: React.FC<{ text: string; children: ReactNode }> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-950 border border-slate-700 text-slate-200 text-[9px] font-mono rounded-lg shadow-xl whitespace-nowrap z-50 animate-in fade-in duration-100"
        >
          {text}
        </div>
      )}
    </div>
  );
};

export const AccessibleMenu: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div role="menu" className="bg-slate-900 border border-slate-800 rounded-xl p-1">
    {children}
  </div>
);

export const AccessibleTabs: React.FC<{
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => (
  <div role="tablist" aria-label="Workspace tabs" className="flex gap-1 border-b border-slate-800 pb-1 font-sans text-xs">
    {tabs.map((tab) => {
      const isAct = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          role="tab"
          aria-selected={isAct}
          aria-controls={`panel-${tab.id}`}
          onClick={() => onTabChange(tab.id)}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
            isAct ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900"
          } ${ACCESSIBILITY_TOKENS.focusRing.standard}`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export const AccessibleAccordion: React.FC<{ title: string; children: ReactNode }> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900 font-sans text-xs select-none">
      <button
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex justify-between p-3 font-bold text-slate-200 text-[11px] ${ACCESSIBILITY_TOKENS.focusRing.standard}`}
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400">{children}</div>}
    </div>
  );
};

export const AccessibleTreeView: React.FC<{ label: string; children?: ReactNode }> = ({ label, children }) => (
  <div role="treeitem" aria-expanded="true" className="pl-3 space-y-1 font-sans text-xs text-slate-300">
    <div className="font-bold text-[11px]">{label}</div>
    {children && <div role="group" className="pl-3 border-l border-slate-800">{children}</div>}
  </div>
);
