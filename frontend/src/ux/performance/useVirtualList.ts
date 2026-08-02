import { useState, useEffect, useRef, RefObject } from "react";
import { PERFORMANCE_TOKENS } from "./performanceTokens";

export interface VirtualListOptions {
  totalItems: number;
  rowHeight?: number;
  containerHeight?: number;
  overscan?: number;
}

export const useVirtualList = ({
  totalItems,
  rowHeight = PERFORMANCE_TOKENS.virtualList.defaultRowHeight,
  containerHeight = 400,
  overscan = PERFORMANCE_TOKENS.virtualList.overscan,
}: VirtualListOptions) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(totalItems - 1, Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan);

  const visibleItems = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, i) => startIndex + i
  );

  const totalHeight = totalItems * rowHeight;
  const offsetY = startIndex * rowHeight;

  const onScroll = (e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
    onScroll,
  };
};

export const useIntersection = (
  ref: RefObject<HTMLElement>,
  options: IntersectionObserverInit = { threshold: 0.1 }
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};
