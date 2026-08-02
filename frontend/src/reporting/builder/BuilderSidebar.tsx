import React, { useState } from "react";
import {
  Database,
  Grid,
  FileSpreadsheet,
  Table,
  BarChart2,
  TrendingUp,
  PieChart,
  Gauge,
  Activity,
  Type,
  Image as ImageIcon,
  Minus,
  Heading,
  Filter,
  Layers,
  Plus,
} from "lucide-react";
import { ElementType, FieldItem, ModuleBinding, BuilderTemplate } from "./types";
import { FieldExplorer } from "./FieldExplorer";
import { MOCK_BUILDER_TEMPLATES } from "./mockFieldsAndTemplates";

interface BuilderSidebarProps {
  activeModule: ModuleBinding;
  onSelectModule: (m: ModuleBinding) => void;
  onAddField: (field: FieldItem) => void;
  onAddElement: (type: ElementType, title: string) => void;
  onSelectTemplate: (tmpl: BuilderTemplate) => void;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  activeModule,
  onSelectModule,
  onAddField,
  onAddElement,
  onSelectTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<"fields" | "elements" | "templates">("fields");

  const elementPalette: { type: ElementType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: "section-header", label: "Section Header", icon: Heading },
    { type: "kpi-card", label: "KPI Card", icon: Activity },
    { type: "table", label: "Data Table", icon: Table },
    { type: "line-chart", label: "Line Chart", icon: TrendingUp },
    { type: "area-chart", label: "Area Chart", icon: TrendingUp },
    { type: "bar-chart", label: "Bar Chart", icon: BarChart2 },
    { type: "pie-chart", label: "Pie Chart", icon: PieChart },
    { type: "donut-chart", label: "Donut Chart", icon: PieChart },
    { type: "gauge", label: "Gauge Meter", icon: Gauge },
    { type: "progress-ring", label: "Progress Ring", icon: Activity },
    { type: "heatmap", label: "Heatmap Matrix", icon: Grid },
    { type: "treemap", label: "Treemap Chart", icon: Layers },
    { type: "filter-panel", label: "Filter Panel", icon: Filter },
    { type: "text-block", label: "Text Block", icon: Type },
    { type: "image", label: "Image Placeholder", icon: ImageIcon },
    { type: "divider", label: "Divider", icon: Minus },
  ];

  return (
    <aside
      aria-label="Report Builder Sidebar Palette"
      className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col h-full text-xs font-sans"
    >
      {/* Sidebar Tabs */}
      <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950 font-semibold text-[11px]">
        <button
          onClick={() => setActiveTab("fields")}
          className={`py-2.5 flex items-center justify-center gap-1 transition-colors ${
            activeTab === "fields"
              ? "bg-indigo-600 text-white border-b-2 border-indigo-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Fields</span>
        </button>

        <button
          onClick={() => setActiveTab("elements")}
          className={`py-2.5 flex items-center justify-center gap-1 transition-colors ${
            activeTab === "elements"
              ? "bg-indigo-600 text-white border-b-2 border-indigo-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Elements</span>
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`py-2.5 flex items-center justify-center gap-1 transition-colors ${
            activeTab === "templates"
              ? "bg-indigo-600 text-white border-b-2 border-indigo-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "fields" && (
          <FieldExplorer
            activeModule={activeModule}
            onSelectModule={onSelectModule}
            onAddField={onAddField}
          />
        )}

        {activeTab === "elements" && (
          <div className="p-3 space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold mb-2">
              Drag or Click to Add Elements
            </div>
            <div className="grid grid-cols-2 gap-2">
              {elementPalette.map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => onAddElement(item.type, item.label)}
                    className="flex flex-col items-center justify-center p-3 bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 rounded-xl text-slate-300 hover:text-white transition-all group shadow-sm"
                  >
                    <IconComp className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                    <span className="text-[11px] font-semibold text-center line-clamp-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="p-3 space-y-3">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold mb-2">
              Report Templates ({MOCK_BUILDER_TEMPLATES.length})
            </div>
            {MOCK_BUILDER_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => onSelectTemplate(tmpl)}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-xl transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900 inline-block mb-1">
                  {tmpl.category}
                </span>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-white mb-1">
                  {tmpl.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                  {tmpl.elements.length} components included
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
