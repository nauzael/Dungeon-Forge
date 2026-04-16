import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

const ERROR_LOG_KEY = 'dungeon_forge_error_log';

interface ErrorLogEntry {
  timestamp: string;
  message: string;
  name: string;
  stack: string;
  componentStack?: string;
  userAgent?: string;
  url?: string;
}

const logErrorToStorage = (error: Error, errorInfo: ErrorInfo) => {
  try {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      message: error.message,
      name: error.name,
      stack: error.stack || 'No stack trace',
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const existingLogs = JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');
    existingLogs.unshift(entry);
    const trimmedLogs = existingLogs.slice(0, 10);
    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(trimmedLogs));

    console.group('🔴 Dungeon Forge Error Captured');
    console.log('Timestamp:', entry.timestamp);
    console.log('Error Name:', entry.name);
    console.log('Error Message:', entry.message);
    console.log('Stack Trace:', entry.stack);
    console.log('Component Stack:', entry.componentStack);
    console.log('User Agent:', entry.userAgent);
    console.log('URL:', entry.url);
    console.groupEnd();
  } catch (e) {
    console.error('Failed to log error to storage:', e);
  }
};

const getErrorLogs = (): ErrorLogEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');
  } catch {
    return [];
  }
};

const clearErrorLogs = () => {
  localStorage.removeItem(ERROR_LOG_KEY);
};

const formatErrorForClipboard = (error: Error, errorInfo: ErrorInfo | null, logs: ErrorLogEntry[]): string => {
  const lines: string[] = [
    '=== DUNGEON FORGE ERROR REPORT ===',
    `Time: ${new Date().toISOString()}`,
    '',
    '--- CURRENT ERROR ---',
    `Type: ${error.name}`,
    `Message: ${error.message}`,
    '',
    '--- STACK TRACE ---',
    error.stack || 'No stack trace',
  ];

  if (errorInfo?.componentStack) {
    lines.push('', '--- COMPONENT STACK ---', errorInfo.componentStack);
  }

  if (logs.length > 0) {
    lines.push('', '--- RECENT ERRORS ---');
    logs.forEach((log, i) => {
      lines.push(`${i + 1}. [${log.timestamp}] ${log.name}: ${log.message}`);
    });
  }

  return lines.join('\n');
};

class ErrorBoundary extends Component<Props, State> {
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, showDetails: false, copied: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logErrorToStorage(error, errorInfo);
    this.setState({ errorInfo });
  }

  private formatStack = (stack: string | undefined): string[] => {
    if (!stack) return [];
    return stack.split('\n').filter(line => line.trim());
  };

  public render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails } = this.state;
      const errorLogs = getErrorLogs();
      const stackLines = this.formatStack(error?.stack);

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F172A] text-white p-6 text-center font-display">
          <div className="bg-red-500/10 p-5 rounded-full mb-6 ring-1 ring-red-500/30">
            <span className="material-symbols-outlined text-5xl text-red-500">error_med</span>
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Something went wrong</h1>
          <p className="text-slate-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
            The application has encountered a critical error and cannot continue.
          </p>

          {error && (
            <div className="w-full max-w-lg bg-black/30 rounded-xl p-4 mb-8 text-left border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Error Details</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const text = formatErrorForClipboard(error, errorInfo, errorLogs);
                      navigator.clipboard.writeText(text).then(() => {
                        this.setState({ copied: true });
                        setTimeout(() => this.setState({ copied: false }), 2000);
                      });
                    }}
                    className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">{this.state.copied ? 'check' : 'content_copy'}</span>
                    {this.state.copied ? 'Copied!' : 'Copy Error'}
                  </button>
                  <button
                    onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    {showDetails ? 'Hide' : 'Show'} Details
                  </button>
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-3">
                <p className="text-xs font-mono text-red-300">
                  <span className="text-slate-500">Type: </span>
                  <span className="text-red-400">{error.name}</span>
                </p>
                <p className="text-xs font-mono text-red-300 mt-1">
                  <span className="text-slate-500">Message: </span>
                  {error.message}
                </p>
              </div>

              {showDetails && (
                <div className="mt-4 space-y-4">
                  {stackLines.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Stack Trace</p>
                      <pre className="text-[10px] font-mono text-slate-400 bg-black/50 rounded-lg p-3 overflow-x-auto max-h-48 whitespace-pre-wrap">
                        {stackLines.map((line, i) => (
                          <div key={i} className="hover:text-white">{line}</div>
                        ))}
                      </pre>
                    </div>
                  )}

                  {errorInfo?.componentStack && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Component Stack</p>
                      <pre className="text-[10px] font-mono text-slate-400 bg-black/50 rounded-lg p-3 overflow-x-auto max-h-48 whitespace-pre-wrap">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Error Log ({errorLogs.length} errors stored)</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {errorLogs.map((log, i) => (
                        <div key={i} className="text-[10px] font-mono bg-black/30 rounded p-2 border border-white/5">
                          <div className="text-slate-500">{log.timestamp}</div>
                          <div className="text-red-400">{log.name}: {log.message}</div>
                          <div className="text-slate-500 truncate">{log.url}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={clearErrorLogs}
                    className="w-full text-xs text-slate-500 hover:text-slate-300 py-2"
                  >
                    Clear Error Logs
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="w-full max-w-xs py-4 bg-[#359EFF] hover:bg-[#2B7DE0] text-[#0F172A] rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            Restart Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
export { getErrorLogs, clearErrorLogs, ERROR_LOG_KEY };
