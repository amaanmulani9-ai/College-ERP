import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, RotateCcw, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error:    Error | null;
  info:     ErrorInfo | null;
  retrying: boolean;
}

export class SettingsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, info: null, retrying: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ info });
    // In production, send to error tracking: Sentry.captureException(error, { extra: info })
    console.error("[SettingsErrorBoundary]", error, info);
  }

  handleRetry = () => {
    this.setState({ retrying: true });
    setTimeout(() => {
      this.setState({ hasError: false, error: null, info: null, retrying: false });
    }, 800);
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error, info, retrying } = this.state;
    const title = this.props.fallbackTitle ?? "Settings Component Error";

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="space-y-5 p-6 text-xs font-sans"
      >
        {/* Error Banner */}
        <div className="flex items-start gap-4 p-5 bg-rose-950/50 border border-rose-800 rounded-2xl">
          <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-base font-bold text-rose-300">{title}</h2>
            <p className="text-[11px] text-rose-400/80 mt-1">
              Something went wrong while rendering this settings section. Your data is safe — this is a UI rendering error.
            </p>
            {error && (
              <code className="block mt-3 p-2.5 bg-rose-950 border border-rose-900 rounded-lg text-[10px] font-mono text-rose-300 break-all">
                {error.name}: {error.message}
              </code>
            )}
          </div>
        </div>

        {/* Recovery Actions */}
        <div className="flex items-center gap-3">
          <button onClick={this.handleRetry} disabled={retrying}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-[11px]">
            <RefreshCw className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} />
            {retrying ? "Retrying…" : "Retry Section"}
          </button>
          <button onClick={this.handleReload}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-colors text-[11px]">
            <RotateCcw className="w-4 h-4" /> Reload Page
          </button>
        </div>

        {/* Stack Trace (dev only) */}
        {info && (
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-[10px] text-slate-500 hover:text-slate-300 transition-colors select-none">
              <Bug className="w-3.5 h-3.5" />
              <span>Show technical details (dev mode)</span>
            </summary>
            <pre className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-mono text-slate-500 overflow-x-auto max-h-64 leading-relaxed">
              {info.componentStack}
            </pre>
          </details>
        )}

        {/* Help Links */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <p className="font-bold text-slate-300 text-[11px] mb-2">If this error persists:</p>
          <ul className="space-y-1.5 text-[10px] text-slate-500 list-disc list-inside">
            <li>Clear your browser cache and reload (Ctrl+Shift+R)</li>
            <li>Try a different browser or incognito window</li>
            <li>Contact IT Support at <a href="mailto:it@nits.edu" className="text-indigo-400 hover:text-indigo-200">it@nits.edu</a></li>
            <li>Reference error ID: <code className="font-mono text-slate-400">{error?.name ?? "ERR"}-{Date.now()}</code></li>
          </ul>
        </div>
      </div>
    );
  }
}
