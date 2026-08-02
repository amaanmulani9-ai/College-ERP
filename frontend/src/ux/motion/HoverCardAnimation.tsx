import React, { ReactNode } from "react";
import { getGPUStyle } from "./motionHelpers";

export const HoverCardAnimation: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div
      style={getGPUStyle()}
      className={`transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/50 ${className}`}
    >
      {children}
    </div>
  );
};

export const ButtonPressAnimation: React.FC<{
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}> = ({ children, onClick, disabled = false, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={getGPUStyle()}
      className={`transition-all duration-150 ease-out active:scale-95 disabled:opacity-40 disabled:active:scale-100 ${className}`}
    >
      {children}
    </button>
  );
};
