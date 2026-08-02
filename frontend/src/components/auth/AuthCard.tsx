import React from "react";
import { motion } from "framer-motion";

export interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-full max-w-md bg-slate-900/80 dark:bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl shadow-black/40 ${className}`}
    >
      {children}
    </motion.div>
  );
};
