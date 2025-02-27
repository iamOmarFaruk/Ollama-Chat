'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/app/lib/context';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';

export default function ChatInput({ chatId }) {
  const { sendMessage, currentModel, setCurrentModel, ollamaStatus } = useApp();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const searchParams = useSearchParams();
  const task = searchParams.get('task');
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  // Pre-fill message with task if provided
  useEffect(() => {
    if (task && !message) {
      setMessage(`I need help with: ${task}`);
    }
  }, [task, message]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading || !currentModel) return;
    
    try {
      setIsLoading(true);
      await sendMessage(message, chatId, currentModel.id);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleModelChange = (e) => {
    const modelId = e.target.value;
    if (!modelId) return;
    
    const model = ollamaStatus.models.find(m => m.id === modelId);
    if (model) {
      setCurrentModel(model);
    }
  };
  
  // Get available active models
  const availableModels = ollamaStatus.models.filter(model => model.isActive) || [];
  
  return (
    <div className="chat-input border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="w-full max-w-6xl mx-auto px-4 chat-input-container">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentModel ? (
              <span>Using model: <span className="font-medium">{currentModel.name}</span></span>
            ) : (
              <span>No model selected</span>
            )}
          </div>
          
          <select
            className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1"
            value={currentModel?.id || ''}
            onChange={handleModelChange}
            disabled={!ollamaStatus.running || availableModels.length === 0}
          >
            {availableModels.length === 0 ? (
              <option value="">No models available</option>
            ) : (
              availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))
            )}
          </select>
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] max-h-[200px]"
            rows={1}
            disabled={isLoading || !ollamaStatus.running || !currentModel}
          />
          
          <button
            type="submit"
            className="absolute right-3 bottom-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim() || isLoading || !ollamaStatus.running || !currentModel}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" size={18} />
            ) : (
              <FaPaperPlane size={18} />
            )}
          </button>
        </form>
        
        {!ollamaStatus.running && (
          <div className="mt-2 text-sm text-red-500">
            Ollama is not running. Please start Ollama to send messages.
          </div>
        )}
        
        {ollamaStatus.running && !currentModel && (
          <div className="mt-2 text-sm text-yellow-500 dark:text-yellow-400">
            No model selected. Please select a model to send messages.
          </div>
        )}
      </div>
    </div>
  );
} 