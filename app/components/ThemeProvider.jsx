'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/app/lib/context';
import LoadingScreen from './LoadingScreen';

export default function ThemeProvider({ children }) {
  const { theme, appLoading } = useApp();
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
  
  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }
  
  // Show loading screen during initial app loading
  if (appLoading) {
    return <LoadingScreen />;
  }
  
  // Return children after loading is complete
  return <>{children}</>;
} 