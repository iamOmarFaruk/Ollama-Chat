'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from './lib/context';
import WelcomeScreen from './components/WelcomeScreen';
import Sidebar from './components/Sidebar';
import ChatInput from './components/ChatInput';
import { motion } from 'framer-motion';
import { FaRobot, FaSpinner } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { ollamaStatus, checkOllamaStatus, createChat, currentModel } = useApp();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  
  // Check Ollama status on mount
  useEffect(() => {
    if (!ollamaStatus.running && !ollamaStatus.checking) {
      checkOllamaStatus();
    }
  }, [ollamaStatus.running, ollamaStatus.checking, checkOllamaStatus]);
  
  // Handle sending the first message
  const handleSendFirstMessage = async (message) => {
    if (!currentModel || !message.trim() || isCreatingChat) return;
    
    try {
      setIsCreatingChat(true);
      const chat = await createChat(currentModel.id);
      if (chat && chat.id) {
        router.push(`/chat/${chat.id}?firstMessage=${encodeURIComponent(message)}`);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      setIsCreatingChat(false);
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="w-64 h-full">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <motion.div 
            className="w-full max-w-3xl px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WelcomeScreen />
          </motion.div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-3xl mx-auto">
            {isCreatingChat ? (
              <div className="flex items-center justify-center py-4">
                <FaSpinner className="animate-spin mr-2" />
                <span>Creating new chat...</span>
              </div>
            ) : (
              <div className="relative">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.target.elements.message;
                  handleSendFirstMessage(input.value);
                  input.value = '';
                }}>
                  <div className="flex items-end gap-2">
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                      <textarea
                        name="message"
                        placeholder={
                          !ollamaStatus.running
                            ? "Ollama is not running. Please start Ollama to begin chatting."
                            : !currentModel
                            ? "Please select a model in the settings to begin chatting."
                            : "Type a message to start a new chat..."
                        }
                        className="w-full px-4 py-3 resize-none bg-transparent focus:outline-none"
                        rows="1"
                        disabled={!ollamaStatus.running || !currentModel}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!ollamaStatus.running || !currentModel || isCreatingChat}
                      className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingChat ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaRobot />
                      )}
                    </button>
                  </div>
                </form>
                
                {!ollamaStatus.running && (
                  <p className="mt-2 text-yellow-600 dark:text-yellow-400 text-sm">
                    Ollama is not running. Please start Ollama to begin chatting.
                  </p>
                )}
                
                {ollamaStatus.running && !currentModel && (
                  <p className="mt-2 text-yellow-600 dark:text-yellow-400 text-sm">
                    No model selected. Please select a model in the settings.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
