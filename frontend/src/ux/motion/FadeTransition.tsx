import React, { ReactNode } from "react";
import { getGPUStyle } from "./motionHelpers";
import { MOTION_VARIANTS } from "./motionVariants";

export interface TransitionProps {
  children: ReactNode;
  show?: boolean;
  className?: string;
}

export const FadeTransition: React.FC<TransitionProps> = ({ children, show = true, className = "" }) => {
  return (
    <div
      style={getGPUStyle()}
      className={`${show ? MOTION_VARIANTS.fade.enter : MOTION_VARIANTS.fade.exit} ${className}`}
    >
      {children}
    </div>
  );
};

export const ScaleTransition: React.FC<TransitionProps> = ({ children, show = true, className = "" }) => {
  return (
    <div
      style={getGPUStyle()}
      className={`${show ? MOTION_VARIANTS.scale.enter : MOTION_VARIANTS.scale.exit} ${className}`}
    >
      {children}
    </div>
  );
};

export const SlideTransition: React.FC<TransitionProps & { direction?: "up" | "down" | "right" }> = ({
  children,
  show = true,
  direction = "up",
  className = "",
}) => {
  const variant = direction === "right" ? MOTION_VARIANTS.slideRight : direction === "down" ? MOTION_VARIANTS.slideDown : MOTION_VARIANTS.slideUp;
  return (
    <div
      style={getGPUStyle()}
      className={`${show ? variant.enter : variant.exit} ${className}`}
    >
      {children}
    </div>
  );
};

export const PageTransition: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div
      style={getGPUStyle()}
      className={`animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out ${className}`}
    >
      {children}
    </div>
  );
};
