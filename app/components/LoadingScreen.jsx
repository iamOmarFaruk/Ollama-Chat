'use client';

import { FaSpinner } from 'react-icons/fa';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-50">
      <div className="text-center">
        <FaSpinner className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Loading Ochat...
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Connecting to Ollama
        </p>
      </div>
    </div>
  );
} 