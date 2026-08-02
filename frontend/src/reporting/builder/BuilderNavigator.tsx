import React from "react";
import { MoveUp, MoveDown, Copy, Trash2, Layers } from "lucide-react";
import { ReportElement } from "./types";

interface BuilderNavigatorProps {
  elements: ReportElement[];
  activeElementId: string | null;
  onSelectElement: (id: string) => void;
  onMoveElement: (id: string, direction: "up" | "down") => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

export const BuilderNavigator: React.FC<BuilderNavigatorProps> = ({
  elements,
  activeElementId,
  onSelectElement,
  onMoveElement,
  onDuplicateElement,
  onDeleteElement,
}) => {
  return (
    <div
      role="region"
      aria-label="Report Structure Navigator"
      className="p-3 bg-slate-900/90 border-t border-slate-800 text-xs font-sans"
    >
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-slate-400 mb-2">
        <Layers className="w-3.5 h-3.5 text-indigo-400" />
        <span>Canvas Hierarchy & Outline ({elements.length})</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {elements.map((el, idx) => {
          const isActive = el.id === activeElementId;
          return (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-indigo-950 border-indigo-600 text-indigo-200 font-bold"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <span className="font-mono text-[10px] text-slate-500">#{idx + 1}</span>
              <span className="truncate max-w-[120px]">{el.title}</span>
              <span className="font-mono text-[9px] px-1 bg-slate-800 rounded text-slate-400">
                {el.gridSpan}c
              </span>

              {isActive && (
                <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onMoveElement(el.id, "up")}
                    disabled={idx === 0}
                    className="p-0.5 hover:bg-indigo-900 rounded disabled:opacity-30"
                    title="Move Left/Up"
                  >
                    <MoveUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onMoveElement(el.id, "down")}
                    disabled={idx === elements.length - 1}
                    className="p-0.5 hover:bg-indigo-900 rounded disabled:opacity-30"
                    title="Move Right/Down"
                  >
                    <MoveDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDuplicateElement(el.id)}
                    className="p-0.5 hover:bg-indigo-900 text-cyan-400 rounded"
                    title="Duplicate Element"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteElement(el.id)}
                    className="p-0.5 hover:bg-rose-950 text-rose-400 rounded"
                    title="Delete Element"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
