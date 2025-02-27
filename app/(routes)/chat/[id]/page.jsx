'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useApp } from '@/app/lib/context';
import axios from 'axios';
import Sidebar from '@/app/components/Sidebar';
import ChatHeader from '@/app/components/ChatHeader';
import Message from '@/app/components/Message';
import ChatInput from '@/app/components/ChatInput';

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const chatId = params.id;
  const task = searchParams.get('task');
  const firstMessage = searchParams.get('firstMessage');
  const { currentChat, setCurrentChat, theme, sendMessage, currentModel } = useApp();
  const messagesEndRef = useRef(null);
  const [isProcessingTask, setIsProcessingTask] = useState(false);
  const [isProcessingFirstMessage, setIsProcessingFirstMessage] = useState(false);
  
  // Fetch chat data
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await axios.get(`/api/chats/${chatId}`);
        setCurrentChat(response.data);
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    };
    
    fetchChat();
    
    // Cleanup
    return () => {
      setCurrentChat(null);
    };
  }, [chatId, setCurrentChat]);
  
  // Handle task parameter
  useEffect(() => {
    const processTask = async () => {
      if (task && currentChat && currentModel && !isProcessingTask && 
          (!currentChat.messages || currentChat.messages.length === 0)) {
        try {
          setIsProcessingTask(true);
          await sendMessage(`I need help with: ${task}`, chatId, currentModel.id);
        } catch (error) {
          console.error('Error processing task:', error);
        } finally {
          setIsProcessingTask(false);
        }
      }
    };
    
    processTask();
  }, [task, currentChat, chatId, sendMessage, currentModel, isProcessingTask]);
  
  // Handle firstMessage parameter
  useEffect(() => {
    const processFirstMessage = async () => {
      if (firstMessage && currentChat && currentModel && !isProcessingFirstMessage && 
          (!currentChat.messages || currentChat.messages.length === 0)) {
        try {
          setIsProcessingFirstMessage(true);
          await sendMessage(firstMessage, chatId, currentModel.id);
        } catch (error) {
          console.error('Error processing first message:', error);
        } finally {
          setIsProcessingFirstMessage(false);
        }
      }
    };
    
    processFirstMessage();
  }, [firstMessage, currentChat, chatId, sendMessage, currentModel, isProcessingFirstMessage]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages]);
  
  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  if (!currentChat) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="w-64 h-full">
          <Sidebar />
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Ensure messages array exists
  const messages = currentChat.messages || [];
  const isProcessing = isProcessingTask || isProcessingFirstMessage;
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="w-64 h-full flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatHeader chat={currentChat} />
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 dark:text-gray-400 max-w-md px-4">
                <h2 className="text-xl font-medium mb-2">Start a conversation</h2>
                <p>Send a message to start chatting with the AI assistant.</p>
                {isProcessing && (
                  <div className="mt-4">
                    <div className="animate-pulse flex space-x-2 justify-center">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <p className="mt-2 text-sm text-blue-500">Processing your message...</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <ChatInput chatId={chatId} />
      </div>
    </div>
  );
} 