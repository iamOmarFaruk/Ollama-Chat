'use client';

import { FaSpinner } from 'react-icons/fa';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-50">
      <div className="text-center px-4 max-w-md">
        <FaSpinner className="animate-spin text-blue-500 mx-auto mb-6" size={40} />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Loading Ochat
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Connecting to Ollama...
        </p>
      </div>
    </div>
  );
} 