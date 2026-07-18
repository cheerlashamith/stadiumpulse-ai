import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Production-grade Error Boundary to catch UI rendering crashes.
 * Prevents the entire app from failing by providing a fallback UI and recovery option.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in React Tree:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">System Interface Error</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              We encountered an unexpected error rendering this component. Our telemetry has logged the issue for the operations team.
            </p>
            {this.state.error && (
              <div className="bg-black/50 p-3 rounded-lg text-left overflow-auto mt-4 border border-slate-800">
                <code className="text-xs text-rose-400 font-mono">
                  {this.state.error.message}
                </code>
              </div>
            )}
            <button 
              onClick={this.handleReset}
              className="mt-6 w-full flex items-center justify-center space-x-2 bg-white text-black py-3 rounded-xl font-bold hover:bg-slate-200 transition"
            >
              <RefreshCw size={18} />
              <span>Restart Interface</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
