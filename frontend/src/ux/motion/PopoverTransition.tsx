import React, { ReactNode } from "react";
import { getGPUStyle } from "./motionHelpers";
import { MOTION_VARIANTS } from "./motionVariants";

export const PopoverTransition: React.FC<{ children: ReactNode; show?: boolean; className?: string }> = ({
  children,
  show = true,
  className = "",
}) => {
  return (
    <div
      style={getGPUStyle()}
      className={`${show ? MOTION_VARIANTS.popover.enter : MOTION_VARIANTS.popover.exit} ${className}`}
    >
      {children}
    </div>
  );
};

export const TooltipTransition: React.FC<{ children: ReactNode; show?: boolean; className?: string }> = ({
  children,
  show = true,
  className = "",
}) => {
  return (
    <div
      style={getGPUStyle()}
      className={`${show ? MOTION_VARIANTS.tooltip.enter : MOTION_VARIANTS.tooltip.exit} ${className}`}
    >
      {children}
    </div>
  );
};

export const DropdownTransition: React.FC<{ children: ReactNode; isOpen: boolean; className?: string }> = ({
  children,
  isOpen,
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={getGPUStyle()}
      className={`${MOTION_VARIANTS.dropdown.enter} ${className}`}
    >
      {children}
    </div>
  );
};

export const AccordionTransition: React.FC<{ children: ReactNode; isOpen: boolean; className?: string }> = ({
  children,
  isOpen,
  className = "",
}) => {
  return (
    <div
      style={getGPUStyle()}
      className={isOpen ? MOTION_VARIANTS.accordion.open : MOTION_VARIANTS.accordion.closed}
    >
      {children}
    </div>
  );
};

export const ToastTransition: React.FC<{ children: ReactNode; show?: boolean; className?: string }> = ({
  children,
  show = true,
  className = "",
}) => {
  return (
    <div
      style={getGPUStyle()}
      className={`${show ? MOTION_VARIANTS.toast.enter : MOTION_VARIANTS.toast.exit} ${className}`}
    >
      {children}
    </div>
  );
};

export const NotificationTransition: React.FC<{ children: ReactNode; show?: boolean; className?: string }> = ({
  children,
  show = true,
  className = "",
}) => {
  return (
    <div
      style={getGPUStyle()}
      className={`${show ? "animate-in slide-in-from-top-3 duration-200" : "animate-out fade-out duration-150"} ${className}`}
    >
      {children}
    </div>
  );
};
