'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/app/lib/context';
import { FaPlus, FaTrash, FaComment, FaMoon, FaSun, FaCog, FaSignOutAlt } from 'react-icons/fa';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import axios from 'axios';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { chats, createChat, fetchChats, currentModel, theme, toggleTheme } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  
  const handleNewChat = async () => {
    try {
      if (!currentModel) {
        router.push('/');
        return;
      }
      
      const chat = await createChat(currentModel.id);
      router.push(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };
  
  const handleDeletePrompt = (e, chatId, chatTitle) => {
    e.preventDefault();
    e.stopPropagation();
    
    setChatToDelete({ id: chatId, title: chatTitle });
    setShowConfirmModal(true);
  };
  
  const handleDeleteChat = async () => {
    if (!chatToDelete || isDeleting) return;
    
    try {
      setIsDeleting(true);
      setDeletingChatId(chatToDelete.id);
      
      // Make direct API call instead of using context function
      await axios.delete(`/api/chats/${chatToDelete.id}`);
      
      // Refresh the chats list
      await fetchChats();
      
      // If we're on the deleted chat's page, redirect to home
      if (pathname === `/chat/${chatToDelete.id}`) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setIsDeleting(false);
      setDeletingChatId(null);
      setChatToDelete(null);
      setShowConfirmModal(false);
    }
  };
  
  // Check if a chat is currently selected
  const isChatSelected = (chatId) => {
    return pathname === `/chat/${chatId}`;
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <FaPlus size={14} />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
          Recent Chats
        </h2>
        
        {!chats || chats.length === 0 ? (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            No chats yet
          </div>
        ) : (
          <ul className="space-y-1">
            {chats.map((chat) => (
              <li key={chat.id}>
                <Link
                  href={`/chat/${chat.id}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                    isChatSelected(chat.id)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FaComment size={14} className="flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  
                  {/* Only show delete button if chat is not currently selected */}
                  {!isChatSelected(chat.id) && (
                    <button
                      onClick={(e) => handleDeletePrompt(e, chat.id, chat.title)}
                      className={`text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 ${
                        isDeleting && deletingChatId === chat.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isDeleting && deletingChatId === chat.id}
                      aria-label="Delete chat"
                    >
                      {isDeleting && deletingChatId === chat.id ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        <FaTrash size={12} />
                      )}
                    </button>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteChat}
        title="Delete Chat"
        message={`Are you sure you want to delete "${chatToDelete?.title || 'this chat'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {theme === 'dark' ? (
              <>
                <FaSun size={14} />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <FaMoon size={14} />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <Link
            href="/settings"
            className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FaCog size={14} />
            <span>Settings</span>
          </Link>
          
          <button
            className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FaSignOutAlt size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
} 