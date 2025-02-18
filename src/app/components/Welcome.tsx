"use client";

import { useEffect, useState } from "react";
import {
  DocumentTextIcon,
  UserCircleIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { FeatureCard } from "./FeatureCard";

interface WelcomeProps {
  onStartChat: () => void;
}


// ============== Welcome Component Start ==============
export const Welcome = ({ onStartChat }: WelcomeProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Welcome to Ollama Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get started by selecting a task and Chat can do the rest. Not sure where to start?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <FeatureCard
          icon={
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
            </div>
          }
          title="Write blog posts"
          delay={100}
        />

        <FeatureCard
          icon={
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-green-600 dark:text-green-500" />
            </div>
          }
          title="Create content"
          delay={200}
        />

        <FeatureCard
          icon={
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
              <CodeBracketIcon className="w-5 h-5 text-purple-600 dark:text-purple-500" />
            </div>
          }
          title="Write code"
          delay={300}
        />

        <FeatureCard
          icon={
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
          }
          title="Make summary"
          delay={400}
        />
      </div>

      <div className="mt-8">
        <button
          onClick={onStartChat}
          className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          Start New Chat
        </button>
      </div>

    </div>
  );
};
// ============== Welcome Component Close ==============
