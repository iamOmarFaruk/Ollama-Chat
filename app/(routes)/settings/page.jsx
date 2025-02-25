'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/app/lib/context';
import Sidebar from '@/app/components/Sidebar';
import { FaArrowLeft, FaMoon, FaSun, FaServer } from 'react-icons/fa';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme, ollamaStatus, checkOllamaStatus } = useApp();
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  
  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="w-64 h-full">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="max-w-4xl mx-auto flex items-center">
            <Link
              href="/"
              className="mr-4 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <FaArrowLeft size={16} />
            </Link>
            <h1 className="text-lg font-medium">Settings</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-medium mb-4">Appearance</h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <div className="flex items-center space-x-3">
                  {theme === 'dark' ? <FaMoon size={18} /> : <FaSun size={18} />}
                  <span>Theme</span>
                </div>
                
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-4">Ollama Settings</h2>
              
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FaServer size={16} />
                  <label htmlFor="ollamaUrl" className="font-medium">Ollama API URL</label>
                </div>
                
                <input
                  id="ollamaUrl"
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="http://localhost:11434"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  The URL where Ollama API is running. Default is http://localhost:11434
                </p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                <div>
                  <div className="font-medium">Ollama Status</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ollamaStatus.running ? 'Running' : 'Not Running'}
                  </div>
                </div>
                
                <button
                  onClick={checkOllamaStatus}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  Check Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 