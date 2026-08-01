import React, { useState, useEffect } from "react";
import { RotateCw } from "lucide-react";

export interface CountdownTimerProps {
  initialSeconds?: number;
  onResend: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds = 60,
  onResend,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResendClick = () => {
    setSecondsLeft(initialSeconds);
    onResend();
  };

  return (
    <div className="text-center text-xs text-slate-400 my-2">
      {secondsLeft > 0 ? (
        <span>
          Resend code in <strong className="text-indigo-400 font-mono">{secondsLeft}s</strong>
        </span>
      ) : (
        <button
          type="button"
          onClick={handleResendClick}
          className="inline-flex items-center gap-1.5 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" /> Resend OTP Code
        </button>
      )}
    </div>
  );
};
