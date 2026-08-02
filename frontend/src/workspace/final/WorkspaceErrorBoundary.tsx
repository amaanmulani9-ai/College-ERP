import React, { Component, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Bug } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class WorkspaceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // In production, report to error tracking here (Sentry, etc.)
    console.error("[WorkspaceErrorBoundary]", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 text-center space-y-5"
      >
        {/* Error icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-lg font-bold text-white">
            {this.props.fallbackTitle ?? "Something went wrong"}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-md">
            An unexpected error occurred in this workspace component. Your data is safe.
          </p>
        </div>

        {/* Error message */}
        {this.state.error && (
          <div className="w-full max-w-md px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-left">
            <p className="text-[11px] font-mono text-rose-300 break-all">
              {this.state.error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
            aria-label="Reload workspace component"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Component
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all border border-slate-700"
            aria-label="Reload entire page"
          >
            Full Reload
          </button>
        </div>

        {/* Report link */}
        <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          <Bug className="w-3.5 h-3.5" />
          Report this issue (placeholder)
        </button>
      </div>
    );
  }
}
