import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw, RotateCcw, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MobileErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Mobile Workspace Crash caught by Error Boundary:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-slate-950 text-slate-100 min-h-[320px] rounded-2xl border border-rose-800 flex flex-col items-center justify-center text-center space-y-4 font-sans select-none">
          <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-bold text-slate-100 text-sm">Mobile Application Interrupted</h3>
            <p className="text-[11px] text-slate-400">
              A temporary render error occurred in this mobile view. No data was lost.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Render</span>
            </button>
            <button
              onClick={this.handleReload}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-[11px] transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
