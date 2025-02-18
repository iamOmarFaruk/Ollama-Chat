"use client";

// -------------------- Imports --------------------
import { useState, useRef, useEffect } from "react";
import { StatusWarning } from "./StatusWarning";
import { ModelSelector } from "./ModelSelector";
import { CodeBlock } from "./CodeBlock";
import { Welcome } from "./Welcome";

// Add the ThinkingAnimation component
const ThinkingAnimation = () => (
  <span className="inline-flex">
    thinking
    <span className="dots ml-1">
      <span className="dot-1">.</span>
      <span className="dot-2">.</span>
      <span className="dot-3">.</span>
    </span>
  </span>
);

// Add the animation styles
const AnimationStyles = () => (
  <style jsx global>{`
    @keyframes dotAnimation {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }

    .dots .dot-1 { animation: dotAnimation 1.5s infinite; }
    .dots .dot-2 { animation: dotAnimation 1.5s infinite 0.5s; }
    .dots .dot-3 { animation: dotAnimation 1.5s infinite 1s; }
  `}</style>
);

// -------------------- Types --------------------
// Type for Chat messages
type Message = {
  content: string;
  isUser: boolean;
};


// -------------------- Main Chat Component --------------------
export default function Chat() {
  
  // ----- States -----
  const [mounted, setMounted] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<'running' | 'not-running' | 'no-models'>('running');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);

  // ----- Refs for DOM and process control -----
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const botMessageIndexRef = useRef<number>(-1);


  // -------------------- Helper Functions --------------------

  // Check if the Ollama API is up (with 2-second timeout)
  const checkOllamaStatus = async (): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:11434/api/version", {
        signal: AbortSignal.timeout(2000)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Fetch available models from API and update states accordingly
  const fetchModels = async () => {
    const isOllamaRunning = await checkOllamaStatus();
    if (!isOllamaRunning) {
      setOllamaStatus('not-running');
      return;
    }

    try {
      const response = await fetch("http://localhost:11434/api/tags");
      if (!response.ok) {
        setOllamaStatus('not-running');
        return;
      }
      const data = await response.json();
      const availableModels = data.models?.map((m: any) =>
        typeof m === "string" ? m : m.name
      ) || [];

      if (availableModels.length === 0) {
        setOllamaStatus('no-models');
      } else {
        setOllamaStatus('running');
        setModels(availableModels);
        setSelectedModel(availableModels[0]);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      setOllamaStatus('not-running');
    }
  };

  // Scroll the chat view to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Adjust the textarea height dynamically according to its content
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  // Handle input change and adjust textarea size
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  // When Enter is pressed (without Shift), send the message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Stop any ongoing AI message generation
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  // Handle sending a message and processing the AI response as a stream
  const handleSendMessage = async () => {
    const message = input.trim();
    if (!message || isLoading || !selectedModel) return;

    setShowWelcome(false);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    // Initialize with thinking state
    setMessages((prev) => {
      const newMessages = [
        ...prev,
        { content: message, isUser: true },
        { content: "<think>thinking...</think>", isUser: false },
      ];
      botMessageIndexRef.current = newMessages.length - 1;
      return newMessages;
    });

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          prompt: message,
          stream: true,
          options: { temperature: 0.7, top_p: 0.95 }
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullResponse += parsed.response;
              setMessages((prev) => {
                const updated = [...prev];
                if (botMessageIndexRef.current !== -1 && botMessageIndexRef.current < updated.length) {
                  // Format the response immediately
                  updated[botMessageIndexRef.current] = { 
                    content: fullResponse,
                    isUser: false 
                  };
                }
                return updated;
              });
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setMessages((prev) => [
          ...prev,
          { content: "Generation stopped by user.", isUser: false },
        ]);
      } else {
        console.error("Detailed error:", error);
        setMessages((prev) => [
          ...prev,
          { content: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`, isUser: false },
        ]);
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  // Add this helper function before the Chat component
  const parseMessageContent = (content: string) => {
    const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
    const codeBlockRegex = /```(\w+)?\n([\s\s]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'typescript',
        content: match[2].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts;
  };


  // -------------------- Effects --------------------

  // Use useEffect to handle client-side initialization
  useEffect(() => {
    setMounted(true);
    setIsClientReady(true);
    fetchModels();

    const intervalId = setInterval(() => {
      if (ollamaStatus !== 'running') {
        fetchModels();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [ollamaStatus]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // -------------------- Layout --------------------
  
  // Don't render anything until mounted
  if (!mounted) {
    return null;
  }

  // If the client isn't ready, show a loading screen
  if (!isClientReady) {
    return (
      <div className="container mx-auto h-screen flex flex-col bg-white">
        <div className="p-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Loading...</h1>
        </div>
      </div>
    );
  }

  // If the client is ready but showWelcome is true and messages are empty, show the welcome screen
  if (mounted && showWelcome && messages.length === 0) {
    return (
      <div className="h-full bg-gray-50 dark:bg-gray-900">
        <Welcome onStartChat={() => setShowWelcome(false)} />
      </div>
    );
  }

  // Main Chat interface
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      
      {/* Messages Section */}
      <main className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 ${
              message.isUser 
                ? "bg-blue-50 dark:bg-blue-900/50" 
                : "bg-white dark:bg-gray-900"
            }`}
          >
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2">
                {message.isUser ? (
                  <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-medium">
                    O
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-500 dark:bg-purple-600 flex items-center justify-center text-white font-medium text-sm">
                    AI
                  </div>
                )}
              </div>
              <div className="flex-1">
                {parseMessageContent(message.content).map((part, i) => {
                  if (part.type === 'code') {
                    return <CodeBlock key={i} code={part.content} language={part.language} />;
                  }
                  
                  const thinkParts = part.content.split(/(<think>[\s\S]*?<\/think>)/g).map((text, j) => {
                    if (text.startsWith('<think>') && text.endsWith('</think>')) {
                      const thinkContent = text.slice(7, -8);
                      return (
                        <span 
                          key={`${i}-${j}`} 
                          className="text-xs text-gray-500 dark:text-gray-400 italic block border-l-2 border-gray-200 dark:border-gray-700 pl-2 my-1"
                        >
                          {thinkContent === 'thinking...' ? <ThinkingAnimation /> : thinkContent}
                        </span>
                      );
                    }
                    return text ? (
                      <span key={`${i}-${j}`} className="whitespace-pre-wrap">
                        {text}
                      </span>
                    ) : null;
                  });
                  
                  return <div key={i}>{thinkParts}</div>;
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Section */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="container mx-auto flex gap-4 items-center max-w-[90vw]">
          <div className="relative flex-1">
            <StatusWarning ollamaStatus={ollamaStatus} />
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base min-h-[60px] max-h-[200px] resize-none overflow-y-auto shadow-sm transition-shadow duration-300 ease-in-out focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
              disabled={isLoading}
              rows={2}
            />
            <ModelSelector
              ollamaStatus={ollamaStatus}
              models={models}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
             
            />
          </div>

          <div className="flex-shrink-0">
            {isLoading ? (
              <button
                onClick={stopGeneration}
                className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-colors bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSendMessage}
                className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer transition-colors bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                disabled={!input.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 py-8">
          AI responses may not always be accurate.
        </div>
      </footer>
    </div>
  );
}
