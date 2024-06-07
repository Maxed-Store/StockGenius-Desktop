import React from 'react';

const ErrorBoundary = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1 style={{ color: '#ff6347', fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
            Oops! Something went wrong!
          </h1>
          <img
            src="https://i.imgur.com/wEtxbmX.png"
            alt="Confused Cartoon Character"
            style={{ width: '200px', height: 'auto' }}
          />
          <p style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif', fontSize: '18px' }}>
            Don't worry, our team of experts is working hard to fix the issue!
          </p>
          <details style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
};

export default ErrorBoundary;