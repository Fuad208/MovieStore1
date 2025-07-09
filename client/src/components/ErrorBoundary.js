// src/components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // Report to error monitoring service (e.g., Sentry)
    // errorReportingService.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          fontFamily: 'Roboto, Arial, sans-serif',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '16px' }}>
            Oops! Something went wrong
          </h2>
          <p style={{ color: '#666', marginBottom: '24px', maxWidth: '500px' }}>
            We're sorry for the inconvenience. The application encountered an unexpected error.
            Please try refreshing the page or contact support if the problem persists.
          </p>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={this.handleRetry}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Try Again
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Refresh Page
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ 
              marginTop: '24px', 
              textAlign: 'left', 
              maxWidth: '800px',
              width: '100%'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                padding: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                marginBottom: '8px'
              }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '16px', 
                overflow: 'auto',
                fontSize: '12px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;