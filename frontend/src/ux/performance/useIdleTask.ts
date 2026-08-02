import { useEffect, useRef } from "react";
import { scheduleIdleTask, cancelIdleTask } from "./performanceUtils";
import { usePerformance } from "./usePerformance";

export const useIdleTask = (task: () => void, deps: any[] = []): void => {
  useEffect(() => {
    const id = scheduleIdleTask(task);
    return () => cancelIdleTask(id);
  }, deps);
};

export const usePrefetch = (importFns: (() => Promise<any>)[]): void => {
  useEffect(() => {
    const id = scheduleIdleTask(() => {
      importFns.forEach((fn) => fn().catch(() => {}));
    });
    return () => cancelIdleTask(id);
  }, []);
};

export const useViewport = (): { width: number; height: number; isMobile: boolean } => {
  const [size, setSize] = useEffectSize();
  return size;
};

function useEffectSize() {
  const [size, setSize] = useStateSize();
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 640,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return [size, setSize] as const;
}

function useStateSize() {
  const [size, setSize] = useRefSize();
  return [size, setSize] as const;
}

function useRefSize() {
  const isBrowser = typeof window !== "undefined";
  return ReactState({
    width: isBrowser ? window.innerWidth : 1024,
    height: isBrowser ? window.innerHeight : 768,
    isMobile: isBrowser ? window.innerWidth < 640 : false,
  });
}

import { useState as ReactState } from "react";

export const useRenderMetrics = (componentName: string): void => {
  const { incrementRenderCount } = usePerformance();
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
    incrementRenderCount();
  });
};
