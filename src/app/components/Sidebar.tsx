"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useChat } from '../providers/ChatProvider';
import { Loader } from './Loader';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export const Sidebar = () => {
   const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { chatHistory,deleteMessage , startNewChat } = useChat();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

// Add this effect to simulate loading
useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);
  },300); // Simulate loading for 1 second

  return () => clearTimeout(timer);
}, []);


  useEffect(() => {
    setMounted(true);
    // Get saved theme from localStorage or use system as default
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, [setTheme]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (theme) {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);




  // Add this near your other useEffect hooks
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (menuOpen && !(event.target as Element).closest('.chat-menu-container')) {
      setMenuOpen(null);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, [menuOpen]);

  // doing this for fix hydration mismatch on theme change since it
  // use local storage
  if (!mounted) {
    return null;
  }

  return (
    <>
     
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out z-40 
          w-80
          lg:relative lg:block border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold">
              Ollama Chat
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* New Chat Button */}
              <button 
                onClick={startNewChat} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
              >
                <ChatBubbleLeftIcon className="w-5 h-5" />
                <span>New Chat</span>
              </button>

              {/* Chat History */}
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Recent Chats
                </h2>

                {/* Chat History List start */}
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    {chatHistory && chatHistory.length > 0 ? (
                      [...chatHistory].reverse().map((chat) => (
                        <div key={chat.id} className="relative group chat-menu-container">
                          {/* Chat Item */}
                          <div 
                            onClick={() => {
                              alert(`Title: ${chat.title}\nID: ${chat.id}\nTime: ${new Date(chat.createdAt).toLocaleString()}`);
                            }}
                            className="w-full flex items-center justify-between px-3 py-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              {/* Chat Icon */}
                              <ChatBubbleLeftIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                              <div className="flex-1 text-left truncate">
                                <span className="block font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {chat.title}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(chat.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
        
                          {/* ৩-ডট মেনু */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(menuOpen === chat.id ? null : chat.id);
                            }}
                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                          >
                            <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
        
                        {/* Dropdown Menu (Delete Option) */}
                        {menuOpen === chat.id && (
                          <div className="absolute right-2 top-10 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50 w-32 border border-gray-200 dark:border-gray-700">
                            <button
                              onClick={() => {
                                deleteMessage(chat.id);
                                setMenuOpen(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                              <TrashIcon className="w-5 h-5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No chat history yet</p>
                    )}
                  </>
                )}
                {/* Chat History List end */}



              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-4">
              {/* Theme Selector */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Theme</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    aria-label="Light theme"
                  >
                    <SunIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    aria-label="Dark theme"
                  >
                    <MoonIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-2 rounded-lg transition-colors ${theme === 'system' ? 'bg-blue-500 text-white dark:bg-blue-600 dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    aria-label="System theme"
                  >
                    <ComputerDesktopIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Settings & Logout */}
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};