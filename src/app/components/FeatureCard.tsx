"use client";

import { useEffect, useState } from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  delay: number;
}

export const FeatureCard = ({ icon, title, delay }: FeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <button 
      className={`flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-500 border border-gray-100 dark:border-gray-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{title}</span>
      <span className="ml-auto text-gray-400">+</span>
    </button>
  );
};