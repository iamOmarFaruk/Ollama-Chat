'use client';

import { useEffect } from 'react';
import { useApp } from '@/app/lib/context';

export default function ChatLayout({ children }) {
  const { theme } = useApp();
  
  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {children}
    </div>
  );
} 