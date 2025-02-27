'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaRegCopy, FaCheck } from 'react-icons/fa';
import { useApp } from '@/app/lib/context';

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const { theme } = useApp();
  const isDarkMode = theme === 'dark';
  
  // Default to javascript if language is not specified
  const lang = language || 'javascript';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="relative my-4 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
          {language || 'javascript'}
        </span>
        <button
          onClick={copyToClipboard}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          aria-label="Copy code"
        >
          {copied ? (
            <FaCheck className="text-green-500" />
          ) : (
            <FaRegCopy />
          )}
        </button>
      </div>
      
      <div className="overflow-x-auto w-full" style={{ maxWidth: '100%' }}>
        <SyntaxHighlighter
          language={lang}
          style={isDarkMode ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            width: '100%',
            maxWidth: '100%',
            overflowX: 'auto',
          }}
          wrapLines={true}
          showLineNumbers={true}
          wrapLongLines={true}
          codeTagProps={{
            style: {
              fontSize: '0.9rem',
              fontFamily: 'var(--font-geist-mono), Menlo, Monaco, Consolas, monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
} 