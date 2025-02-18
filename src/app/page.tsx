"use client";

import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import { Sidebar } from './components/Sidebar';

// ==================== start ===================
// Home কম্পোনেন্টটি Chat কম্পোনেন্টটি রেন্ডার করে এবং একটি সতর্কতা বার্তা দেখায়।
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative overflow-y-hidden">
        <Chat />
      </main>
    </div>
  );
}
// ==================== end ===================