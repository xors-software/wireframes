'use client';

import { useState } from 'react';

interface ApiKeyInputProps {
  apiKey: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  onSetApiKey: (key: string) => void;
  onClearApiKey: () => void;
}

export function ApiKeyInput({
  apiKey,
  isConnected,
  isLoading,
  error,
  onSetApiKey,
  onClearApiKey,
}: ApiKeyInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSetApiKey(inputValue.trim());
      setInputValue('');
      setIsOpen(false);
    }
  };

  const handleDisconnect = () => {
    onClearApiKey();
    setIsOpen(false);
  };

  return (
    <>
      {/* Connection Status Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="api-key-button"
        title={isConnected ? 'Connected - Click to manage' : 'Click to connect API key'}
      >
        <span className="status-label">MODE</span>
        <span className="status-indicator">
          <span className={`status-dot ${isConnected ? 'connected' : ''}`} />
          <span className="status-text">
            {isLoading ? '...' : isConnected ? 'LIVE' : 'LOCAL'}
          </span>
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>API Connection</h2>
              <button className="modal-close" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {isConnected ? (
                <div className="connected-state">
                  <div className="connection-status">
                    <span className="status-dot connected" />
                    <span>Connected to XORS API</span>
                  </div>
                  <p className="api-key-preview">
                    Key: {apiKey?.slice(0, 8)}...{apiKey?.slice(-4)}
                  </p>
                  <button className="btn btn-disconnect" onClick={handleDisconnect}>
                    DISCONNECT
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="modal-description">
                    Enter your XORS API key to play with real tokens. Without an API key, you&apos;ll play in local mode with demo tokens.
                  </p>
                  <div className="input-group">
                    <input
                      type="password"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter your API key..."
                      className="api-key-input"
                      autoFocus
                    />
                  </div>
                  {error && <p className="error-message">{error}</p>}
                  <button
                    type="submit"
                    className="btn btn-connect"
                    disabled={!inputValue.trim() || isLoading}
                  >
                    {isLoading ? 'CONNECTING...' : 'CONNECT'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .api-key-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 8px 16px;
          height: 52px;
          min-width: 90px;
          font-family: inherit;
          border: none;
          background: #1a1a1a;
          color: #faf7f2;
          cursor: pointer;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .api-key-button:hover {
          background: #2a2a2a;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #8a8580;
        }

        .status-dot.connected {
          background: #16a34a;
          box-shadow: 0 0 6px rgba(22, 163, 74, 0.5);
        }

        .status-label {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.15em;
          opacity: 0.7;
          text-transform: uppercase;
        }

        .status-text {
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
          font-variant-numeric: tabular-nums;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .modal-content {
          background: #faf7f2;
          border: 2px solid #1a1a1a;
          max-width: 400px;
          width: 100%;
          font-family: "SF Mono", "Monaco", "Inconsolata", monospace;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 2px solid #1a1a1a;
          background: #f0ebe3;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .modal-close {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
          color: #1a1a1a;
        }

        .modal-close:hover {
          background: #1a1a1a;
          color: #faf7f2;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-description {
          font-size: 12px;
          line-height: 1.6;
          margin: 0 0 16px 0;
          color: #5a5550;
        }

        .input-group {
          margin-bottom: 16px;
        }

        .api-key-input {
          width: 100%;
          padding: 12px;
          font-family: inherit;
          font-size: 14px;
          border: 2px solid #1a1a1a;
          background: #ffffff;
          outline: none;
          box-sizing: border-box;
        }

        .api-key-input:focus {
          border-color: #ff6b00;
        }

        .api-key-input::placeholder {
          color: #b5b0a8;
        }

        .error-message {
          color: #c25550;
          font-size: 12px;
          margin: 0 0 12px 0;
        }

        .btn {
          width: 100%;
          padding: 14px;
          font-family: inherit;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.2em;
          border: 2px solid #1a1a1a;
          cursor: pointer;
          transition: all 0.1s ease;
        }

        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-connect {
          background: #1a1a1a;
          color: #ff6b00;
        }

        .btn-connect:hover:not(:disabled) {
          background: #2a2a2a;
        }

        .btn-disconnect {
          background: #c25550;
          color: #faf7f2;
          border-color: #c25550;
        }

        .btn-disconnect:hover {
          background: #a84540;
        }

        .connected-state {
          text-align: center;
        }

        .connection-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .api-key-preview {
          font-size: 12px;
          color: #8a8580;
          margin: 0 0 20px 0;
        }
      `}</style>
    </>
  );
}
