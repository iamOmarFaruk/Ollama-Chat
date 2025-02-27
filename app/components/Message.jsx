'use client';

import { useEffect, useRef } from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';
import CodeBlock from './CodeBlock';
import { parseMessageContent } from '@/app/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useApp } from '@/app/lib/context';

export default function Message({ message }) {
  const messageRef = useRef(null);
  const { theme } = useApp();
  const isDarkMode = theme === 'dark';
  
  // Scroll to new messages
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  const isUser = message.role === 'user';
  const messageParts = parseMessageContent(message.content);
  
  // Custom renderer for code blocks within markdown
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && language) {
        return (
          <CodeBlock 
            key={Math.random()}
            code={String(children).replace(/\n$/, '')} 
            language={language} 
          />
        );
      }
      
      return (
        <code 
          className={`${className || ''} px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-mono text-sm`} 
          {...props}
        >
          {children}
        </code>
      );
    }
  };
  
  return (
    <div 
      ref={messageRef}
      className={`py-6 w-full ${isUser ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}`}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex items-start space-x-4 w-full">
          <div className={`flex-shrink-0 rounded-full p-2 ${
            isUser 
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
              : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
          }`}>
            {isUser ? <FaUser size={16} /> : <FaRobot size={16} />}
          </div>
          
          <div className="flex-1 space-y-2 overflow-hidden w-full">
            <div className="font-medium">
              {isUser ? 'You' : 'Assistant'}
            </div>
            
            <div className="prose dark:prose-invert max-w-none w-full">
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
                  return (
                    <div key={index} className="markdown-content w-full">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        components={components}
                      >
                        {part.content}
                      </ReactMarkdown>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 