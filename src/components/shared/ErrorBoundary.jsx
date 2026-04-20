import React from 'react';

/**
 * Global Error Boundary to catch unhandled rendering exceptions.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-surface text-on-surface p-4 text-center">
          <div className="bg-error/10 text-error p-6 rounded-2xl max-w-lg">
            <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
            <p className="mb-4">We've encountered an unexpected error. Please try refreshing the page or navigating back.</p>
            <p className="text-sm opacity-80 font-mono overflow-auto max-h-32 text-left bg-black/10 p-2 rounded">
              {this.state.error && this.state.error.toString()}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
