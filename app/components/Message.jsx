'use client';

import { useEffect, useRef } from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';
import CodeBlock from './CodeBlock';
import { parseMessageContent } from '@/app/lib/utils';

export default function Message({ message }) {
  const messageRef = useRef(null);
  
  // Scroll to new messages
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  const isUser = message.role === 'user';
  const messageParts = parseMessageContent(message.content);
  
  return (
    <div 
      ref={messageRef}
      className={`py-6 ${isUser ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}`}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 rounded-full p-2 ${
            isUser 
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
              : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
          }`}>
            {isUser ? <FaUser size={16} /> : <FaRobot size={16} />}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="font-medium">
              {isUser ? 'You' : 'Assistant'}
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              {messageParts.map((part, index) => {
                if (part.type === 'code') {
                  return (
                    <CodeBlock 
                      key={index} 
                      code={part.content} 
                      language={part.language} 
                    />
                  );
                } else {
                  return part.content.split('\n').map((line, i) => (
                    <p key={`${index}-${i}`} className={line.trim() === '' ? 'h-4' : ''}>
                      {line}
                    </p>
                  ));
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 