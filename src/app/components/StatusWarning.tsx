'use client';

import { useState } from 'react';

type StatusWarningProps = {
  ollamaStatus: 'running' | 'not-running' | 'no-models';
};

export const StatusWarning = ({ ollamaStatus }: StatusWarningProps) => {
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  if (ollamaStatus === 'not-running') {
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg relative">
        <div className="flex items-center text-red-800 mb-2">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Ollama is not running!</span>
        </div>
        <p className="text-sm text-red-700">
          Please start Ollama by running this command in your terminal:
        </p>
        <div className="relative mt-2">
          <code className="block p-2 bg-red-100 rounded text-sm">ollama serve</code>
          <button 
            onClick={() => handleCopy('ollama serve')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-red-200 rounded"
            title="Copy to clipboard"
          >
            {showCopyNotification ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
        {showCopyNotification && (
          <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm animate-fade-out">
            Copied to clipboard!
          </div>
        )}
      </div>
    );
  }

  if (ollamaStatus === 'no-models') {
    return (
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg relative">
        <div className="flex items-center text-yellow-800 mb-2">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">No models installed!</span>
        </div>
        <p className="text-sm text-yellow-700">
          Install a model by running this command in your terminal:
        </p>
        <div className="relative mt-2">
          <code className="block p-2 bg-yellow-100 rounded text-sm">ollama pull mistral</code>
          <button 
            onClick={() => handleCopy('ollama pull mistral')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-yellow-200 rounded"
            title="Copy to clipboard"
          >
            {showCopyNotification ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
        {showCopyNotification && (
          <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm animate-fade-out">
            Copied to clipboard!
          </div>
        )}
      </div>
    );
  }

  return null;
}; 