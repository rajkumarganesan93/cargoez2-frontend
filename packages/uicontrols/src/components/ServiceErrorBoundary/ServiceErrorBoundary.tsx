import React, { Component } from "react";

export interface ServiceErrorBoundaryProps {
  /** Display name of the service (e.g. "Contacts", "Freight") */
  serviceName: string;
  /** Optional custom fallback to render instead of the default UI */
  fallback?: React.ReactNode;
  /** Called when the error boundary catches an error */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Called when the user clicks "Retry" */
  onRetry?: () => void;
  children: React.ReactNode;
}

interface ServiceErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ServiceErrorBoundary extends Component<
  ServiceErrorBoundaryProps,
  ServiceErrorBoundaryState
> {
  static displayName = "ServiceErrorBoundary";

  constructor(props: ServiceErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ServiceErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  private isNetworkError(): boolean {
    const msg = this.state.error?.message?.toLowerCase() ?? "";
    return (
      msg.includes("failed to fetch") ||
      msg.includes("dynamically imported module") ||
      msg.includes("load") ||
      msg.includes("network") ||
      msg.includes("remoteentry")
    );
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const isNetwork = this.isNetworkError();
    const { serviceName } = this.props;

    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {isNetwork ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              )}
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-text-primary">
            {isNetwork
              ? `${serviceName} Service Unavailable`
              : `Something Went Wrong`}
          </h2>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed">
            {isNetwork
              ? `The ${serviceName} service is not responding. It may be down for maintenance or temporarily unreachable.`
              : `An unexpected error occurred while loading ${serviceName}. Please try again.`}
          </p>

          {/* Retry button */}
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-contrast font-semibold text-sm transition-all duration-200 cursor-pointer hover:opacity-90"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
              />
            </svg>
            Retry
          </button>

          {/* Error details (collapsed) */}
          {this.state.error && (
            <details className="text-left mt-4">
              <summary className="text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
                Technical details
              </summary>
              <pre className="mt-2 p-3 bg-bg-secondary rounded-lg text-xs text-text-secondary overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}

export default ServiceErrorBoundary;
