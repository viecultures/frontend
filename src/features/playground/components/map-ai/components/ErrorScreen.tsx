/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export interface ExtendedErrorType {
  code?: number;
  message?: string;
  status?: string;
}

export default function ErrorScreen() {
  const { activeView, connectionError, connecting, retry } = useLiveAPIContext();
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const error = connectionError ? { message: connectionError } : null;

  const quotaErrorMessage =
    'You have hit the limited free quota for today. Please come back tomorrow to continue.';

  let errorMessage = 'Something went wrong. Please try again.';
  let rawMessage: string | null = error?.message || null;
  let tryAgainOption = true;
  if (error?.message?.includes('RESOURCE_EXHAUSTED')) {
    errorMessage = quotaErrorMessage;
    rawMessage = null;
    tryAgainOption = false;
  }

  if (!activeView || !error || dismissedError === connectionError) {
    return <div style={{ display: 'none' }} />;
  }

  return (
    <div className="error-screen">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ef4444',
          marginBottom: '12px',
        }}
      >
        <AlertCircle size={48} />
      </div>
      <div
        className="error-message-container"
        style={{
          fontSize: 22,
          lineHeight: 1.2,
          opacity: 0.8,
        }}
      >
        {errorMessage}
      </div>
      {tryAgainOption ? (
        <button
          className="close-button"
          onClick={() => {
            setDismissedError(connectionError);
          }}
        >
          Close
        </button>
      ) : null}
      {tryAgainOption && <button disabled={connecting} onClick={() => void retry()}>Thử lại</button>}
      {rawMessage ? (
        <div
          className="error-raw-message-container"
          style={{
            fontSize: 15,
            lineHeight: 1.2,
            opacity: 0.6,
          }}
        >
          {rawMessage}
        </div>
      ) : null}
    </div>
  );
}
