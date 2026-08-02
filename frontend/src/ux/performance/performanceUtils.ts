export const scheduleIdleTask = (callback: () => void): number => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    return (window as any).requestIdleCallback(callback);
  }
  return setTimeout(callback, 1) as unknown as number;
};

export const cancelIdleTask = (id: number): void => {
  if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

export const measureRenderTime = (label: string, callback: () => void): number => {
  if (typeof performance === "undefined") {
    callback();
    return 0;
  }
  const start = performance.now();
  callback();
  const end = performance.now();
  const duration = end - start;
  if (duration > 16.6) {
    console.warn(`[Performance Warning] ${label} render took ${duration.toFixed(2)}ms (Exceeded 16.6ms frame budget)`);
  }
  return duration;
};

export const preloadComponent = (importFn: () => Promise<any>): void => {
  scheduleIdleTask(() => {
    importFn().catch(() => {});
  });
};
