'use client';

import { useState } from 'react';
import { useApp } from '@/app/lib/context';
import { FaCircle, FaSync, FaDownload } from 'react-icons/fa';

export default function OllamaStatus() {
  const { ollamaStatus, checkOllamaStatus, pullModel } = useApp();
  const [modelToPull, setModelToPull] = useState('');
  const [isPulling, setIsPulling] = useState(false);
  
  const handlePullModel = async (e) => {
    e.preventDefault();
    
    if (!modelToPull) return;
    
    try {
      setIsPulling(true);
      await pullModel(modelToPull);
      setModelToPull('');
    } catch (error) {
      console.error('Error pulling model:', error);
    } finally {
      setIsPulling(false);
    }
  };
  
  // Ensure models array exists
  const models = ollamaStatus.models || [];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaCircle 
            className={ollamaStatus.running ? "text-green-500" : "text-red-500"} 
            size={12} 
          />
          <span className="font-medium">
            Ollama Status: {ollamaStatus.running ? 'Running' : 'Not Running'}
          </span>
        </div>
        
        <button
          onClick={checkOllamaStatus}
          className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          disabled={ollamaStatus.checking}
        >
          <FaSync 
            className={`${ollamaStatus.checking ? 'animate-spin' : ''}`} 
            size={12} 
          />
          <span>Refresh</span>
        </button>
      </div>
      
      {!ollamaStatus.running && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm">
          <p className="font-medium mb-2">Ollama is not running</p>
          <p className="mb-2">Please start Ollama with the following command:</p>
          <div className="bg-gray-800 text-gray-200 p-2 rounded font-mono text-xs overflow-x-auto">
            $ ollama serve
          </div>
        </div>
      )}
      
      {ollamaStatus.running && models.length === 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm">
          <p className="font-medium mb-2">No models available</p>
          <p className="mb-2">Pull a model to get started:</p>
          
          <form onSubmit={handlePullModel} className="flex space-x-2">
            <input
              type="text"
              value={modelToPull}
              onChange={(e) => setModelToPull(e.target.value)}
              placeholder="e.g., llama3"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPulling}
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center space-x-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={!modelToPull || isPulling}
            >
              <FaDownload size={12} />
              <span>{isPulling ? 'Pulling...' : 'Pull'}</span>
            </button>
          </form>
        </div>
      )}
      
      {ollamaStatus.running && models.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Available Models:</h3>
          <ul className="space-y-2">
            {models.map((model) => (
              <li 
                key={model.id} 
                className={`p-3 rounded-md border ${
                  model.isActive 
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaCircle 
                      className={model.isActive ? "text-green-500" : "text-gray-400"} 
                      size={10} 
                    />
                    <span>{model.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {model.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pull another model:</p>
            <form onSubmit={handlePullModel} className="flex space-x-2">
              <input
                type="text"
                value={modelToPull}
                onChange={(e) => setModelToPull(e.target.value)}
                placeholder="e.g., llama3"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isPulling}
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center space-x-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={!modelToPull || isPulling}
              >
                <FaDownload size={12} />
                <span>{isPulling ? 'Pulling...' : 'Pull'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 