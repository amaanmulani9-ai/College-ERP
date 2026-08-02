import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ReportingErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, showDetails: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Reporting Platform Runtime Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-100 min-h-[400px] rounded-2xl border border-rose-900/50 m-4 font-sans text-xs shadow-2xl">
          <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-2xl text-rose-400 mb-4">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <h2 className="text-base font-extrabold text-slate-100 mb-1">
            Reporting Component Render Recovery Mode
          </h2>
          <p className="text-xs text-slate-400 text-center max-w-md mb-4 leading-relaxed">
            An isolated UI runtime exception occurred in the reporting component view. Your saved drafts and analytics state remain safe.
          </p>

          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Platform Component</span>
            </button>

            <button
              onClick={() => this.setState({ showDetails: !this.state.showDetails })}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl font-mono text-[11px]"
            >
              <span>{this.state.showDetails ? "Hide Stack" : "Inspect Exception"}</span>
              {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {this.state.showDetails && (
            <div className="w-full max-w-xl p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[10px] text-rose-300 overflow-x-auto">
              <p className="font-bold mb-1">{this.state.error?.toString()}</p>
              <pre className="text-slate-400 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
