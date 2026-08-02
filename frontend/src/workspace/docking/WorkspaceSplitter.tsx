import React, { useState, useRef, useCallback } from "react";

type SplitDir = "horizontal" | "vertical";

interface WorkspaceSplitterProps {
  direction?: SplitDir;
  initialRatio?: number;
  onRatioChange?: (ratio: number) => void;
  children: [React.ReactNode, React.ReactNode];
}

export const WorkspaceSplitter: React.FC<WorkspaceSplitterProps> = ({
  direction = "horizontal",
  initialRatio = 0.5,
  onRatioChange,
  children,
}) => {
  const [ratio, setRatio] = useState(initialRatio);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    dragging.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor =
      direction === "horizontal" ? "col-resize" : "row-resize";

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newRatio: number;
      if (direction === "horizontal") {
        newRatio = (e.clientX - rect.left) / rect.width;
      } else {
        newRatio = (e.clientY - rect.top) / rect.height;
      }
      newRatio = Math.min(0.85, Math.max(0.15, newRatio));
      setRatio(newRatio);
      onRatioChange?.(newRatio);
    };

    const handleMouseUp = () => {
      dragging.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, [direction, onRatioChange]);

  const isHorizontal = direction === "horizontal";

  return (
    <div
      ref={containerRef}
      className={`flex ${isHorizontal ? "flex-row" : "flex-col"} w-full h-full overflow-hidden`}
    >
      {/* Pane A */}
      <div
        style={{ [isHorizontal ? "width" : "height"]: `${ratio * 100}%` }}
        className="overflow-auto min-w-0 min-h-0"
      >
        {children[0]}
      </div>

      {/* Draggable Divider */}
      <div
        onMouseDown={handleMouseDown}
        className={`
          flex-shrink-0 z-10 transition-colors
          ${
            isHorizontal
              ? "w-1.5 cursor-col-resize hover:bg-indigo-500/60"
              : "h-1.5 cursor-row-resize hover:bg-indigo-500/60"
          }
          bg-slate-800 hover:bg-indigo-500
        `}
        role="separator"
        aria-orientation={isHorizontal ? "vertical" : "horizontal"}
        aria-label={`${direction} splitter`}
        title={`Drag to resize ${direction === "horizontal" ? "columns" : "rows"}`}
      />

      {/* Pane B */}
      <div className="flex-1 overflow-auto min-w-0 min-h-0">
        {children[1]}
      </div>
    </div>
  );
};
