import React, { ReactNode } from "react";
import { CheckCircle2, Award, Download, Upload, Save, AlertTriangle, Clock, ShieldAlert, UserCheck } from "lucide-react";

export interface StateCardProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const SuccessState: React.FC<StateCardProps> = ({
  icon: Icon = CheckCircle2,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => (
  <div className={`p-6 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl text-center space-y-3 font-sans select-none ${className}`}>
    <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 mx-auto">
      <Icon className="w-6 h-6" />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h4 className="font-bold text-slate-100 text-sm">{title}</h4>
      {description && <p className="text-[11px] text-emerald-200/80 leading-relaxed">{description}</p>}
    </div>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[11px] transition-all active:scale-95 shadow-md"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export const CompletedState: React.FC = () => (
  <SuccessState icon={Award} title="Task Completed Successfully" description="All processing steps finalized and archived." />
);

export const OperationSuccessful: React.FC = () => (
  <SuccessState icon={CheckCircle2} title="Operation Successful" description="Database transaction committed cleanly." />
);

export const ImportSuccess: React.FC = () => (
  <SuccessState icon={Upload} title="Import Complete" description="Student records uploaded and validated." />
);

export const ExportSuccess: React.FC = () => (
  <SuccessState icon={Download} title="Export Generated" description="Report file ready for download." />
);

export const SaveSuccess: React.FC = () => (
  <SuccessState icon={Save} title="Changes Saved" description="Workspace configuration updated." />
);

export const WarningState: React.FC<StateCardProps> = ({
  icon: Icon = AlertTriangle,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => (
  <div className={`p-6 bg-amber-950/40 border border-amber-800/80 rounded-2xl text-center space-y-3 font-sans select-none ${className}`}>
    <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-700 flex items-center justify-center text-amber-400 mx-auto">
      <Icon className="w-6 h-6" />
    </div>
    <div className="space-y-1 max-w-sm mx-auto">
      <h4 className="font-bold text-slate-100 text-sm">{title}</h4>
      {description && <p className="text-[11px] text-amber-200/80 leading-relaxed">{description}</p>}
    </div>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-[11px] transition-all active:scale-95 shadow-md"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export const PendingApproval: React.FC = () => (
  <WarningState icon={Clock} title="Pending Administrative Approval" description="Request submitted to Dean Office for signature." />
);

export const UnsavedChanges: React.FC<{ onSave?: () => void }> = ({ onSave }) => (
  <WarningState icon={AlertTriangle} title="Unsaved Changes Detected" description="You have modified settings that are not yet committed." actionLabel="Save Now" onAction={onSave} />
);

export const IncompleteProfile: React.FC = () => (
  <WarningState icon={UserCheck} title="Profile Setup Incomplete" description="Upload your digital signature and update phone number to finalize onboarding." />
);
