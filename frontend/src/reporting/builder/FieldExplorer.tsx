import React, { useState, useMemo } from "react";
import {
  Search,
  Star,
  Clock,
  ChevronRight,
  ChevronDown,
  Plus,
  Database,
} from "lucide-react";
import { FieldItem, ModuleBinding } from "./types";
import { MOCK_BUILDER_FIELDS } from "./mockFieldsAndTemplates";

interface FieldExplorerProps {
  activeModule: ModuleBinding;
  onSelectModule: (m: ModuleBinding) => void;
  onAddField: (field: FieldItem) => void;
}

const MODULES: ModuleBinding[] = [
  "Students",
  "Attendance",
  "Fees",
  "Payroll",
  "HR",
  "Library",
  "Transport",
  "Assets",
  "Inventory",
  "Placement",
  "AI",
];

export const FieldExplorer: React.FC<FieldExplorerProps> = ({
  activeModule,
  onSelectModule,
  onAddField,
}) => {
  const [fields, setFields] = useState<FieldItem[]>(MOCK_BUILDER_FIELDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleFavorite = (fieldId: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  };

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filter fields for current module and search query
  const filteredFields = useMemo(() => {
    return fields.filter((f) => {
      const matchesModule = f.module === activeModule;
      const matchesSearch =
        !searchQuery ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesModule && matchesSearch;
    });
  }, [fields, activeModule, searchQuery]);

  // Group by category
  const categories = useMemo(() => {
    const map = new Map<string, FieldItem[]>();
    filteredFields.forEach((f) => {
      if (!map.has(f.category)) map.set(f.category, []);
      map.get(f.category)!.push(f);
    });
    return Array.from(map.entries());
  }, [filteredFields]);

  const favoriteFields = fields.filter((f) => f.module === activeModule && f.isFavorite);
  const recentFields = fields.filter((f) => f.module === activeModule && f.isRecent);

  return (
    <div className="flex flex-col h-full bg-slate-900/90 text-xs font-sans border-r border-slate-800">
      {/* Module Selector */}
      <div className="p-3 border-b border-slate-800 bg-slate-950">
        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
          Active ERP Module Data Source
        </label>
        <div className="relative">
          <select
            value={activeModule}
            onChange={(e) => onSelectModule(e.target.value as ModuleBinding)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-indigo-300 font-semibold focus:ring-2 focus:ring-indigo-500"
          >
            {MODULES.map((mod) => (
              <option key={mod} value={mod}>
                {mod} Module
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Field Search */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fields (e.g. Name, Amount)..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Field List Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Favorites Section */}
        {favoriteFields.length > 0 && !searchQuery && (
          <div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider mb-1.5">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>Starred Fields</span>
            </div>
            <div className="space-y-1">
              {favoriteFields.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-2 bg-slate-950 border border-amber-900/30 rounded-md hover:border-indigo-500/50 group cursor-pointer"
                  onClick={() => onAddField(f)}
                >
                  <span className="font-medium text-slate-200 truncate">{f.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddField(f);
                    }}
                    className="p-1 text-indigo-400 hover:text-white rounded"
                    title="Add to canvas"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Grouping */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
            All Fields ({filteredFields.length})
          </div>

          {categories.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No matching fields found.</p>
          ) : (
            categories.map(([catName, catFields]) => {
              const isCollapsed = collapsedCategories[catName];
              return (
                <div key={catName} className="space-y-1">
                  <button
                    onClick={() => toggleCategoryCollapse(catName)}
                    className="w-full flex items-center justify-between py-1 text-slate-300 hover:text-white font-semibold text-xs border-b border-slate-800"
                  >
                    <div className="flex items-center gap-1.5">
                      {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{catName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{catFields.length}</span>
                  </button>

                  {!isCollapsed && (
                    <div className="space-y-1 pl-2 pt-1">
                      {catFields.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between p-2 bg-slate-950/80 border border-slate-800 rounded-md hover:border-indigo-500/60 group cursor-pointer transition-colors"
                          onClick={() => onAddField(f)}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950 px-1 py-0.5 rounded border border-indigo-900">
                              {f.type}
                            </span>
                            <span className="font-medium text-slate-300 group-hover:text-white truncate">
                              {f.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(f.id);
                              }}
                              className={`p-1 ${f.isFavorite ? "text-amber-400 fill-amber-400" : "text-slate-600 hover:text-slate-400"}`}
                            >
                              <Star className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddField(f);
                              }}
                              className="p-1 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded transition-colors"
                              title="Add to canvas"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
