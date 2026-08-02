import React from "react";

interface CommandGroupProps {
  heading: string;
  children: React.ReactNode;
}

export const CommandGroup: React.FC<CommandGroupProps> = ({ heading, children }) => {
  return (
    <div className="space-y-1 my-2">
      <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
        {heading}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
};
