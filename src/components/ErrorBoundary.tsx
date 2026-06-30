import { Component } from 'react';
import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="m-4 p-6 rounded-xl border border-secondary/40 bg-secondary-tint text-text">
          <h2 className="text-lg font-semibold mb-2">
            Algo se rompió en la app
          </h2>
          <p className="text-sm text-text-muted mb-4">
            {this.state.error.message}
          </p>
          <button
            type="button"
            className="rounded-md bg-bg-card border border-border-soft px-3 py-1.5 text-sm"
            onClick={() => this.setState({ error: null })}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
