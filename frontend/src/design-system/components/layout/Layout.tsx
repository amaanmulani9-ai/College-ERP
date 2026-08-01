import React from "react";

// ─── Containers ────────────────────────────────────────────────────────────
export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`space-y-6 max-w-7xl mx-auto w-full ${className}`}>{children}</div>;

export const ContentContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`p-6 bg-slate-950 border border-slate-800 rounded-3xl ${className}`}>{children}</div>;

export const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <section className={`space-y-4 py-2 ${className}`}>{children}</section>;

// ─── Flex & Stack ──────────────────────────────────────────────────────────
export interface FlexProps {
  children: React.ReactNode;
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  gap?: 1 | 2 | 3 | 4 | 6 | 8;
  className?: string;
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

const gapMap = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = "row",
  align = "center",
  justify = "start",
  gap = 4,
  className = "",
}) => (
  <div
    className={`flex ${direction === "col" ? "flex-col" : "flex-row"} ${alignMap[align]} ${justifyMap[justify]} ${gapMap[gap]} ${className}`}
  >
    {children}
  </div>
);

export const Stack: React.FC<Omit<FlexProps, "direction">> = (props) => (
  <Flex direction="col" align="stretch" {...props} />
);

// ─── Grid ──────────────────────────────────────────────────────────────────
export interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 1 | 2 | 3 | 4 | 6 | 8;
  className?: string;
}

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-12",
};

export const Grid: React.FC<GridProps> = ({ children, cols = 3, gap = 4, className = "" }) => (
  <div className={`grid ${colsMap[cols]} ${gapMap[gap]} ${className}`}>{children}</div>
);

// ─── Divider & Spacer ──────────────────────────────────────────────────────
export const Divider: React.FC<{ orientation?: "horizontal" | "vertical"; className?: string }> = ({
  orientation = "horizontal",
  className = "",
}) => (
  <div
    className={`${
      orientation === "horizontal" ? "w-full h-px border-b" : "h-full w-px border-r"
    } border-slate-800 ${className}`}
  />
);

export const Spacer: React.FC<{ size?: 2 | 4 | 6 | 8 | 12 }> = ({ size = 4 }) => {
  const sizeMap = { 2: "h-2", 4: "h-4", 6: "h-6", 8: "h-8", 12: "h-12" };
  return <div className={sizeMap[size]} aria-hidden="true" />;
};

// ─── AspectRatio & ScrollArea & ResizablePanel ─────────────────────────────
export const AspectRatio: React.FC<{ ratio?: "16/9" | "4/3" | "1/1"; children: React.ReactNode }> = ({
  ratio = "16/9",
  children,
}) => {
  const ratioMap = { "16/9": "aspect-video", "4/3": "aspect-4/3", "1/1": "aspect-square" };
  return <div className={`relative w-full ${ratioMap[ratio]} overflow-hidden`}>{children}</div>;
};

export const ScrollArea: React.FC<{ maxHeight?: number | string; children: React.ReactNode }> = ({
  maxHeight = 400,
  children,
}) => (
  <div
    style={{ maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }}
    className="overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800"
  >
    {children}
  </div>
);

export const ResizablePanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="resize-x overflow-auto min-w-[200px] border border-slate-800 rounded-2xl p-4">
    {children}
  </div>
);
