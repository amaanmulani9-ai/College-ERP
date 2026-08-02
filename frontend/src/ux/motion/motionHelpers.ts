import { MOTION_TOKENS, MotionDuration, MotionEasing } from "./motionTokens";

export const getGPUStyle = (): React.CSSProperties => ({
  willChange: "transform, opacity",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
});

export const isReducedMotionPreferred = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const getTransitionDuration = (
  duration: MotionDuration,
  reduced: boolean = false
): number => {
  if (reduced || isReducedMotionPreferred()) {
    return MOTION_TOKENS.duration.reduced;
  }
  return MOTION_TOKENS.duration[duration];
};

export const getTransitionClass = (
  duration: MotionDuration = "normal",
  easing: MotionEasing = "standard"
): string => {
  if (isReducedMotionPreferred()) {
    return "transition-none";
  }
  return `transition-all duration-${MOTION_TOKENS.duration[duration]} ease-out`;
};
