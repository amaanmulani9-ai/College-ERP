export const PERFORMANCE_TOKENS = {
  fps: {
    target: 60,
    budgetMs: 16.6,
    warningMs: 33.3, // Below 30 FPS threshold
  },
  memory: {
    maxHeapMB: 512,
    warningHeapMB: 256,
  },
  virtualList: {
    defaultRowHeight: 48,
    overscan: 5,
  },
  bundle: {
    maxChunkKB: 500,
    warningChunkKB: 300,
  },
} as const;
