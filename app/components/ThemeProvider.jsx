'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/app/lib/context';

export default function ThemeProvider({ children }) {
  const { theme } = useApp();
  const [mounted, setMounted] = useState(false);
  
  // Only run after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme class to the HTML element
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [theme, mounted]);
  
  // Return children directly during SSR to avoid hydration mismatch
  return <>{children}</>;
} 