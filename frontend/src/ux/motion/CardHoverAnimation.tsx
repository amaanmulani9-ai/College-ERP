import React, { ReactNode } from "react";
import { getGPUStyle } from "./motionHelpers";

export const CardHoverAnimation: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div
      style={getGPUStyle()}
      className={`transition-all duration-200 ease-out hover:scale-[1.01] hover:border-slate-700 hover:shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
};

export const ListItemAnimation: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div
      style={getGPUStyle()}
      className={`transition-all duration-150 ease-out hover:bg-slate-900 hover:translate-x-1 ${className}`}
    >
      {children}
    </div>
  );
};

export const FABAnimation: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}> = ({ children, onClick, className = "", ariaLabel = "Floating Action Button" }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={getGPUStyle()}
      className={`transition-all duration-200 ease-out hover:scale-110 active:scale-95 shadow-xl ${className}`}
    >
      {children}
    </button>
  );
};
