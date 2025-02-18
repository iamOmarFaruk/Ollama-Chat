"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

// Mock chat history data
const mockHistory = [
  { id: 1, title: "Chat about React Components", date: "2024-03-20" },
  { id: 2, title: "Discussion on API Design", date: "2024-03-19" },
  { id: 3, title: "Debugging Session", date: "2024-03-18" },
  { id: 4, title: "Code Review Chat", date: "2024-03-17" },
];

export const Sidebar = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  
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

  if (!mounted) {
    return null;
  }

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out z-40 
          ${isOpen ? "w-64" : "w-0 -translate-x-full lg:translate-x-0 lg:w-20"}
          lg:relative lg:block border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className={`text-xl font-semibold ${!isOpen && "lg:hidden"}`}>
              Ollama Chat
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* New Chat Button */}
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100">
                <ChatBubbleLeftIcon className="w-5 h-5" />
                {isOpen && <span>New Chat</span>}
              </button>

              {/* Chat History */}
              <div className="space-y-2">
                <h2 className={`text-sm font-semibold text-gray-500 dark:text-gray-400 ${!isOpen && "lg:hidden"}`}>
                  Recent Chats
                </h2>
                {mockHistory.map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    {isOpen && (
                      <div className="flex-1 text-left truncate">
                        <span className="block truncate">{chat.title}</span>
                        <span className="text-xs text-gray-500">{chat.date}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-4">
              {/* Theme Selector */}
              <div className={`flex ${isOpen ? 'justify-between' : 'justify-center'} items-center`}>
                {isOpen && <span className="text-sm">Theme</span>}
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
                  {isOpen && <span>Settings</span>}
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                  {isOpen && <span>Logout</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};