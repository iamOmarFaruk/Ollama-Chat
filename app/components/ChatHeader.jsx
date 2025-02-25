'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/app/lib/context';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function ChatHeader({ chat }) {
  const { currentModel } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chat?.title || 'New Chat');
  const [originalTitle, setOriginalTitle] = useState(chat?.title || 'New Chat');
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (chat?.title) {
      setTitle(chat.title);
      setOriginalTitle(chat.title);
    }
  }, [chat?.title]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleEditTitle = () => {
    setIsEditing(true);
  };
  
  const handleSaveTitle = async () => {
    if (!title.trim()) {
      setTitle(originalTitle);
      setIsEditing(false);
      return;
    }
    
    try {
      await axios.patch(`/api/chats/${chat.id}`, { title });
      setOriginalTitle(title);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating chat title:', error);
      setTitle(originalTitle);
    }
  };
  
  const handleCancelEdit = () => {
    setTitle(originalTitle);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <button
                onClick={handleSaveTitle}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                aria-label="Save title"
              >
                <FaCheck size={14} />
              </button>
              
              <button
                onClick={handleCancelEdit}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                aria-label="Cancel edit"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-medium truncate">{title}</h1>
              
              <button
                onClick={handleEditTitle}
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                aria-label="Edit title"
              >
                <FaEdit size={14} />
              </button>
            </div>
          )}
        </div>
        
        {chat?.model && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Model: <span className="font-medium">{chat.model.name}</span>
          </div>
        )}
      </div>
    </div>
  );
} 