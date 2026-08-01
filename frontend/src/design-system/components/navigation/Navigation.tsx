import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  Command,
  Search,
  Folder,
  File,
  Menu,
  MoreVertical,
} from "lucide-react";
import { Button } from "../Button";

// ─── Tabs & VerticalTabs ───────────────────────────────────────────────────
export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "pills" | "line";
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "line",
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto ${
        variant === "line"
          ? "border-b border-slate-800"
          : "p-1 bg-slate-900 border border-slate-800 rounded-2xl"
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
              variant === "line"
                ? isActive
                  ? "border-b-2 border-indigo-500 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
                : isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 rounded-xl"
                : "text-slate-400 hover:text-white rounded-xl"
            } ${tab.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-slate-950/60 border border-slate-800 text-indigo-300">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const VerticalTabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full max-w-xs ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left ${
              isActive
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 font-bold"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            } ${tab.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            {tab.icon}
            <span className="flex-1 truncate">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-slate-900 text-indigo-300 border border-slate-800">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ─── Breadcrumb ───────────────────────────────────────────────────────────
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
    {items.map((item, idx) => {
      const isLast = idx === items.length - 1;
      return (
        <React.Fragment key={idx}>
          {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
          {item.href && !isLast ? (
            <Link to={item.href} className="hover:text-indigo-400 flex items-center gap-1">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className={`flex items-center gap-1 ${isLast ? "text-white font-bold" : ""}`}>
              {item.icon}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      );
    })}
  </nav>
);

// ─── PageHeader & SectionHeader ────────────────────────────────────────────
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => (
  <div className="space-y-2 pb-4 border-b border-slate-800/80">
    {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  </div>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({
  title,
  subtitle,
  actions,
}) => (
  <div className="flex items-center justify-between gap-4 pb-2">
    <div>
      <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

// ─── Accordion & Collapse ──────────────────────────────────────────────────
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export const Accordion: React.FC<{ items: AccordionItem[]; allowMultiple?: boolean }> = ({
  items,
}) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              className="w-full p-4 text-left text-xs font-bold text-white flex items-center justify-between hover:bg-slate-900/60 transition-colors"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed bg-slate-900/30">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Collapse = Accordion;

// ─── TreeView ──────────────────────────────────────────────────────────────
export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export const TreeView: React.FC<{ nodes: TreeNode[] }> = ({ nodes }) => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (id: string) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExp = expanded.includes(node.id);

    return (
      <div key={node.id} style={{ paddingLeft: depth * 16 }} className="space-y-1">
        <button
          onClick={() => hasChildren && toggle(node.id)}
          className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 w-full text-left"
        >
          {hasChildren ? (
            <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
          ) : (
            <File className="w-4 h-4 text-slate-500 shrink-0" />
          )}
          <span className="truncate">{node.label}</span>
          {hasChildren && (
            <ChevronRight
              className={`w-3.5 h-3.5 text-slate-500 ml-auto transition-transform ${
                isExp ? "transform rotate-90" : ""
              }`}
            />
          )}
        </button>
        {hasChildren && isExp && (
          <div className="space-y-0.5">{node.children!.map((c) => renderNode(c, depth + 1))}</div>
        )}
      </div>
    );
  };

  return <div className="space-y-1">{nodes.map((n) => renderNode(n))}</div>;
};

// ─── MegaMenu / ContextMenu / DropdownMenu Placeholders ────────────────────
export const MegaMenu: React.FC = () => (
  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl text-xs text-slate-300">
    MegaMenu Container
  </div>
);

export const ContextMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="inline-block">{children}</div>
);

export const DropdownMenu = ContextMenu;
export const CommandMenu = ContextMenu;
export const SidebarMenu = VerticalTabs;
export const Stepper = Tabs;
