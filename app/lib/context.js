'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
const AppContext = createContext();

// Context provider
export function AppProvider({ children }) {
  const [ollamaStatus, setOllamaStatus] = useState({
    running: false,
    checking: true,
    models: []
  });
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentModel, setCurrentModel] = useState(null);
  const [theme, setTheme] = useState('dark');
  
  // Initialize theme from localStorage on mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('ochat-theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);
  
  // Check Ollama status on mount
  useEffect(() => {
    checkOllamaStatus();
    fetchChats();
  }, []);
  
  // Check Ollama status
  const checkOllamaStatus = async () => {
    try {
      setOllamaStatus(prev => ({ ...prev, checking: true }));
      const response = await axios.get('/api/status');
      
      const statusData = {
        running: response.data.running,
        models: response.data.models || [],
        ollamaModels: response.data.ollamaModels || [],
        checking: false
      };
      
      setOllamaStatus(statusData);
      
      // Set default model if available
      if (statusData.models.length > 0 && !currentModel) {
        const activeModels = statusData.models.filter(m => m.isActive);
        if (activeModels.length > 0) {
          setCurrentModel(activeModels[0]);
        } else if (statusData.models.length > 0) {
          setCurrentModel(statusData.models[0]);
        }
      }
    } catch (error) {
      console.error('Error checking Ollama status:', error);
      setOllamaStatus({
        running: false,
        models: [],
        checking: false
      });
    }
  };
  
  // Fetch chats
  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/chats');
      setChats(response.data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    }
  };
  
  // Create a new chat
  const createChat = async (modelId) => {
    if (!modelId && currentModel) {
      modelId = currentModel.id;
    }
    
    if (!modelId) {
      throw new Error('No model selected');
    }
    
    try {
      const response = await axios.post('/api/chats', {
        title: 'New Chat',
        modelId
      });
      
      const newChat = response.data;
      
      if (newChat) {
        setChats(prev => [newChat, ...(prev || [])]);
        setCurrentChat({
          ...newChat,
          messages: []
        });
      }
      
      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };
  
  // Delete a chat
  const deleteChat = async (chatId) => {
    if (!chatId) {
      console.error('No chat ID provided for deletion');
      return;
    }
    
    try {
      // Make direct API call to delete the chat
      await axios.delete(`/api/chats/${chatId}`);
      
      // Update local state after successful deletion
      setChats(prev => (prev || []).filter(chat => chat.id !== chatId));
      
      // If the deleted chat is the current chat, clear it
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw new Error('Failed to delete chat. Please try again.');
    }
  };
  
  // Send a message
  const sendMessage = async (message, chatId, modelId) => {
    if (!modelId && currentModel) {
      modelId = currentModel.id;
    }
    
    if (!modelId) {
      throw new Error('No model selected');
    }
    
    try {
      const response = await axios.post('/api/chat', {
        chatId,
        message,
        modelId
      });
      
      // If it's a new chat, add it to the list
      if (!chatId) {
        fetchChats();
        setCurrentChat(prev => ({
          ...prev,
          id: response.data.chatId,
          messages: [response.data.userMessage, response.data.assistantMessage]
        }));
      } else {
        // Update current chat with new messages
        setCurrentChat(prev => ({
          ...prev,
          messages: [...((prev?.messages || [])), response.data.userMessage, response.data.assistantMessage]
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('ochat-theme', newTheme);
    }
  };
  
  // Pull a model
  const pullModel = async (modelName) => {
    if (!modelName) return;
    
    try {
      const response = await axios.post('/api/models', {
        modelName
      });
      
      // Refresh status after pulling
      setTimeout(checkOllamaStatus, 2000);
      
      return response.data;
    } catch (error) {
      console.error('Error pulling model:', error);
      throw error;
    }
  };
  
  return (
    <AppContext.Provider
      value={{
        ollamaStatus,
        chats,
        currentChat,
        setCurrentChat,
        currentModel,
        setCurrentModel,
        theme,
        checkOllamaStatus,
        fetchChats,
        createChat,
        deleteChat,
        sendMessage,
        toggleTheme,
        pullModel
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 