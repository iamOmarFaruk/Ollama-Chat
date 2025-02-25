'use client';

import { useEffect } from 'react';
import { useApp } from './lib/context';
import WelcomeScreen from './components/WelcomeScreen';

export default function Home() {
  const { ollamaStatus, checkOllamaStatus } = useApp();
  
  // Check Ollama status on mount
  useEffect(() => {
    if (!ollamaStatus.running && !ollamaStatus.checking) {
      checkOllamaStatus();
    }
  }, [ollamaStatus.running, ollamaStatus.checking, checkOllamaStatus]);
  
  return <WelcomeScreen />;
}
