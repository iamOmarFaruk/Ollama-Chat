'use client';

import { useEffect } from 'react';
import { useApp } from '@/app/lib/context';

export default function ThemeProvider({ children }) {
  const { theme } = useApp();
  
  useEffect(() => {
    // Apply theme class to the HTML element
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [theme]);
  
  return <>{children}</>;
} 