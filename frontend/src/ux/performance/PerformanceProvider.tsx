import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PerformanceContextType {
  fps: number;
  jsHeapMB: number;
  showMonitorOverlay: boolean;
  setShowMonitorOverlay: (show: boolean) => void;
  renderCount: number;
  incrementRenderCount: () => void;
}

export const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fps, setFps] = useState<number>(60.0);
  const [jsHeapMB, setJsHeapMB] = useState<number>(24.8);
  const [showMonitorOverlay, setShowMonitorOverlay] = useState<boolean>(false);
  const [renderCount, setRenderCount] = useState<number>(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const tick = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.min(60.0, Math.round((frameCount * 1000) / (now - lastTime))));
        frameCount = 0;
        lastTime = now;

        // Check performance.memory API if available
        const perf: any = performance;
        if (perf && perf.memory) {
          setJsHeapMB(Math.round(perf.memory.usedJSHeapSize / (1024 * 1024)));
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const incrementRenderCount = () => {
    setRenderCount((prev) => prev + 1);
  };

  return (
    <PerformanceContext.Provider
      value={{
        fps,
        jsHeapMB,
        showMonitorOverlay,
        setShowMonitorOverlay,
        renderCount,
        incrementRenderCount,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};
