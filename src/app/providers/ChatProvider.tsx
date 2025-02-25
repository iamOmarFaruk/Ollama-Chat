"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  createdAt: string;
};

type Chat = {
  id: string;
  title: string;
  createdAt: string;
};

type ChatContextType = {
  chatHistory: Chat[];
  messages: Message[]; // Add messages to context
  fetchMessages: () => void;
  sendMessage: (content: string) => void;
  deleteMessage: (id: string) => void;
  startNewChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);


  // display chat history 
  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      const data = await response.json();
      setMessages(data);

      // Create Chat History from messages
      const history = data
        .reduce((acc: Chat[], msg: Message) => {
          if (!acc.find(chat => chat.id === msg.id)) {
            acc.push({
              id: msg.id,
              title: msg.content.slice(0, 20) + "...",
              createdAt: msg.createdAt,
            });
          }
          return acc;
        }, []);

      setChatHistory(history);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };


  // send message - add new chat to database
  const sendMessage = async (content: string) => {
    // Define the temporary message outside the try block
    const tempMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      createdAt: new Date().toISOString()
    };

    try {
      // Optimistically update UI
      setMessages(prev => [...prev, tempMessage]);

      // Send to server
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, isUser: true }),
      });

      const savedMessage = await response.json();

      // Update with actual server response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? savedMessage : msg
        )
      );

      // Update chat history
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };

  // delete message from database
  const deleteMessage = async (id: string) => {
    try {
      await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      setMessages(messages.filter(msg => msg.id !== id));
      fetchMessages(); // Update chat history
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // start new chat
  const startNewChat = () => {
    setMessages([]); // Clear messages to start fresh
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <ChatContext.Provider 
      value={{ 
        chatHistory, 
        messages, // Expose messages in context
        fetchMessages, 
        sendMessage, 
        deleteMessage, 
        startNewChat 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
