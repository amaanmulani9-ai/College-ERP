import React, { ReactNode } from "react";
import { useVirtualList } from "./useVirtualList";

export interface VirtualScrollProps<T> {
  items: T[];
  height?: number;
  rowHeight?: number;
  renderItem: (item: T, index: number) => ReactNode;
}

export function VirtualScrollContainer<T>({
  items,
  height = 400,
  rowHeight = 48,
  renderItem,
}: VirtualScrollProps<T>) {
  const { visibleItems, totalHeight, offsetY, onScroll } = useVirtualList({
    totalItems: items.length,
    rowHeight,
    containerHeight: height,
  });

  return (
    <div
      onScroll={onScroll}
      style={{ height, overflowY: "auto" }}
      className="border border-slate-800 rounded-2xl bg-slate-900 font-sans text-xs scrollbar-thin"
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)`, position: "absolute", top: 0, left: 0, right: 0 }}>
          {visibleItems.map((index) => (
            <div key={index} style={{ height: rowHeight }}>
              {renderItem(items[index], index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const ViewportObserver: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback = <div className="h-24 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionRef(ref);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
};

function useIntersectionRef(ref: React.RefObject<HTMLElement>) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}
