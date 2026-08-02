import React, { useState, useEffect, useCallback } from "react";
import {
  ReportElement,
  ElementType,
  ModuleBinding,
  FieldItem,
  BuilderTemplate,
  PreviewDevice,
} from "./types";
import { MOCK_BUILDER_TEMPLATES } from "./mockFieldsAndTemplates";
import { BuilderToolbar } from "./BuilderToolbar";
import { BuilderSidebar } from "./BuilderSidebar";
import { BuilderCanvas } from "./BuilderCanvas";
import { BuilderProperties } from "./BuilderProperties";
import { BuilderNavigator } from "./BuilderNavigator";
import { BuilderPreview } from "./BuilderPreview";
import { useTabs } from "../../workspace/TabContext";

const LOCAL_STORAGE_BUILDER_KEY = "college_erp_report_builder_draft_v1";

export const ReportBuilder: React.FC = () => {
  const [title, setTitle] = useState("Custom Executive Performance Report");
  const [description, setDescription] = useState(
    "Drag & drop custom analytics canvas report template."
  );
  const [activeModule, setActiveModule] = useState<ModuleBinding>("Students");
  const [elements, setElements] = useState<ReportElement[]>(
    MOCK_BUILDER_TEMPLATES[0].elements
  );
  const [activeElementId, setActiveElementId] = useState<string | null>(
    MOCK_BUILDER_TEMPLATES[0].elements[0]?.id || null
  );

  const [history, setHistory] = useState<ReportElement[][]>([
    MOCK_BUILDER_TEMPLATES[0].elements,
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // TabContext workspace integration
  let openTabAction: ((tab: { title: string; route: string; iconName?: string }) => void) | null = null;
  try {
    const tabsCtx = useTabs();
    if (tabsCtx && tabsCtx.openTab) {
      openTabAction = tabsCtx.openTab;
    }
  } catch (_e) {
    openTabAction = null;
  }

  // Save history state for undo/redo
  const pushHistory = useCallback((nextElements: ReportElement[]) => {
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      return [...updated, nextElements];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUpdateElements = (nextElements: ReportElement[]) => {
    setElements(nextElements);
    pushHistory(nextElements);
  };

  // LocalStorage Auto-Save
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BUILDER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.elements && parsed.elements.length > 0) {
          setElements(parsed.elements);
          setHistory([parsed.elements]);
          setHistoryIndex(0);
        }
        if (parsed.lastSavedAt) setLastSavedAt(parsed.lastSavedAt);
      }
    } catch (e) {
      console.error("Failed to load report builder draft", e);
    }
  }, []);

  const saveDraftToStorage = useCallback(() => {
    try {
      const nowStr = new Date().toLocaleTimeString();
      localStorage.setItem(
        LOCAL_STORAGE_BUILDER_KEY,
        JSON.stringify({ title, description, activeModule, elements, lastSavedAt: nowStr })
      );
      setLastSavedAt(nowStr);
    } catch (e) {
      console.error("Failed to save report builder draft", e);
    }
  }, [title, description, activeModule, elements]);

  // Global Keyboard Shortcuts (Undo, Redo, Save, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveDraftToStorage();
      } else if (e.key === "Delete" && activeElementId && !isPreviewMode) {
        handleDeleteElement(activeElementId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history, activeElementId, isPreviewMode, saveDraftToStorage]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setElements(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setElements(history[nextIdx]);
    }
  };

  const handleAddElement = (type: ElementType, elementTitle: string) => {
    const newEl: ReportElement = {
      id: `el-${Date.now()}`,
      type,
      title: elementTitle,
      gridSpan: type === "kpi-card" ? 4 : type === "section-header" ? 12 : 6,
      dataBinding: { module: activeModule, fields: [] },
    };
    const next = [...elements, newEl];
    handleUpdateElements(next);
    setActiveElementId(newEl.id);
  };

  const handleAddField = (field: FieldItem) => {
    const newEl: ReportElement = {
      id: `el-field-${Date.now()}`,
      type: field.type === "number" ? "kpi-card" : "table",
      title: `${field.name} (${field.category})`,
      gridSpan: field.type === "number" ? 4 : 6,
      dataBinding: { module: field.module, fields: [field.name] },
    };
    const next = [...elements, newEl];
    handleUpdateElements(next);
    setActiveElementId(newEl.id);
  };

  const handleSelectTemplate = (tmpl: BuilderTemplate) => {
    setTitle(tmpl.name);
    setDescription(tmpl.description);
    setActiveModule(tmpl.module);
    setElements(tmpl.elements);
    pushHistory(tmpl.elements);
    setActiveElementId(tmpl.elements[0]?.id || null);
  };

  const handleUpdateElementProps = (updated: ReportElement) => {
    const next = elements.map((e) => (e.id === updated.id ? updated : e));
    handleUpdateElements(next);
  };

  const handleDeleteElement = (id: string) => {
    const next = elements.filter((e) => e.id !== id);
    handleUpdateElements(next);
    if (activeElementId === id) setActiveElementId(null);
  };

  const handleDuplicateElement = (id: string) => {
    const target = elements.find((e) => e.id === id);
    if (target) {
      const dup: ReportElement = {
        ...target,
        id: `el-dup-${Date.now()}`,
        title: `${target.title} (Copy)`,
      };
      const next = [...elements, dup];
      handleUpdateElements(next);
      setActiveElementId(dup.id);
    }
  };

  const handleMoveElement = (id: string, direction: "up" | "down") => {
    const idx = elements.findIndex((e) => e.id === id);
    if (idx === -1) return;
    const next = [...elements];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < next.length) {
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      handleUpdateElements(next);
    }
  };

  const activeElement = elements.find((e) => e.id === activeElementId) || null;

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Toolbar */}
      <BuilderToolbar
        title={title}
        onTitleChange={setTitle}
        lastSavedAt={lastSavedAt}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        previewDevice={previewDevice}
        onPreviewDeviceChange={setPreviewDevice}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onSelectTemplate={handleSelectTemplate}
        onSaveDraft={saveDraftToStorage}
        onOpenInWorkspace={
          openTabAction
            ? () =>
                openTabAction!({
                  title: `Builder: ${title}`,
                  route: `/reporting/builder`,
                  iconName: "FileSpreadsheet",
                })
            : undefined
        }
      />

      {/* Main Workspace Area: Editor Mode vs Live Preview Mode */}
      {isPreviewMode ? (
        <BuilderPreview
          title={title}
          description={description}
          elements={elements}
          device={previewDevice}
          onExitPreview={() => setIsPreviewMode(false)}
        />
      ) : (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Palette & Field Explorer Sidebar */}
          <BuilderSidebar
            activeModule={activeModule}
            onSelectModule={setActiveModule}
            onAddField={handleAddField}
            onAddElement={handleAddElement}
            onSelectTemplate={handleSelectTemplate}
          />

          {/* Center Interactive Drag/Grid Canvas & Navigator */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
            <BuilderCanvas
              elements={elements}
              activeElementId={activeElementId}
              onSelectElement={setActiveElementId}
              onDeleteElement={handleDeleteElement}
              onDuplicateElement={handleDuplicateElement}
            />

            {/* Bottom Hierarchy Navigator */}
            <BuilderNavigator
              elements={elements}
              activeElementId={activeElementId}
              onSelectElement={setActiveElementId}
              onMoveElement={handleMoveElement}
              onDuplicateElement={handleDuplicateElement}
              onDeleteElement={handleDeleteElement}
            />
          </div>

          {/* Right Inspector & Properties Sidebar */}
          <BuilderProperties
            element={activeElement}
            onUpdateElement={handleUpdateElementProps}
            onDeleteElement={handleDeleteElement}
          />
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;
