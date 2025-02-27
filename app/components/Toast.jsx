'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { useApp } from '@/app/lib/context';

export default function Toast({ message, type = 'success', onClose, duration = 1000 }) {
  const { theme } = useApp();
  const isDarkMode = theme === 'dark';
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);
  
  if (!message) return null;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" size={18} />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" size={18} />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" size={18} />;
      default:
        return <FaInfoCircle className="text-blue-500" size={18} />;
    }
  };
  
  return (
    <AnimatePresence>
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              delay: 0.3 // 300ms delay before showing
            }}
            className={`flex items-center p-3 px-4 rounded-lg shadow-lg border ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700 text-white' 
                : 'bg-white/90 backdrop-blur-sm border-gray-200 text-gray-800'
            }`}
          >
            <div className="mr-3">
              {getIcon()}
            </div>
            <p className="text-sm font-medium">{message}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 