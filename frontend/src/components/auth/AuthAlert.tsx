import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export interface AuthAlertProps {
  type?: "error" | "success" | "info";
  message: string;
}

export const AuthAlert: React.FC<AuthAlertProps> = ({ type = "error", message }) => {
  const getStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-950/60 border-red-800/80 text-red-300",
          icon: <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
        };
      case "success":
        return {
          bg: "bg-emerald-950/60 border-emerald-800/80 text-emerald-300",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
        };
      case "info":
      default:
        return {
          bg: "bg-indigo-950/60 border-indigo-800/80 text-indigo-300",
          icon: <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />,
        };
    }
  };

  const style = getStyles();

  return (
    <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 mb-4 ${style.bg}`}>
      {style.icon}
      <span>{message}</span>
    </div>
  );
};
