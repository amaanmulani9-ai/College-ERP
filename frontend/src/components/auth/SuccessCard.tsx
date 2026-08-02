import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export interface SuccessCardProps {
  title: string;
  message: string;
  actionText?: string;
  actionRoute?: string;
}

export const SuccessCard: React.FC<SuccessCardProps> = ({
  title,
  message,
  actionText = "Sign In to Portal",
  actionRoute = "/login",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-4 py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </motion.div>

      <div className="space-y-1">
        <h3 className="text-2xl font-extrabold text-white">{title}</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">{message}</p>
      </div>

      <div className="pt-2">
        <Link
          to={actionRoute}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 inline-block"
        >
          {actionText}
        </Link>
      </div>
    </motion.div>
  );
};
