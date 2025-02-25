"use client";

// -------------------- Imports --------------------
import { useState, useRef, useEffect } from "react";
import { StatusWarning } from "./StatusWarning";
import { ModelSelector } from "./ModelSelector";
import { CodeBlock } from "./CodeBlock";
import { Welcome } from "./Welcome";

type Message = {
  content: string;
  isUser: boolean;
};

// -------------------- Main Chat Component --------------------
export default function Chat() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // -------------------- 🔹 API থেকে মেসেজ লোড করা (নতুন) --------------------
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages"); // ✅ ডাটাবেস থেকে মেসেজ লোড
        const data = await response.json();
        setMessages(data); // ✅ UI-তে সেট করা
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []); // ✅ শুধুমাত্র প্রথমবার রান হবে

  // -------------------- 🔹 নতুন মেসেজ পাঠানো (POST API Call) --------------------
  const handleSendMessage = async () => {
    const message = input.trim();
    if (!message) return;

    const newMessage = { content: message, isUser: true };
    setMessages([...messages, newMessage]); // ✅ UI তে নতুন মেসেজ দেখানো
    setInput("");

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // -------------------- 🔹 UI তে পুরনো মেসেজ দেখানো --------------------
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <main className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 ${
              message.isUser ? "bg-blue-50 dark:bg-blue-900/50" : "bg-white dark:bg-gray-900"
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
                <span className="whitespace-pre-wrap">{message.content}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* -------------------- 🔹 ইনপুট ফিল্ড এবং সেন্ড বাটন -------------------- */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="container mx-auto flex gap-4 items-center max-w-[90vw]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder="Type your message here..."
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base min-h-[60px] max-h-[200px] resize-none overflow-y-auto shadow-sm transition-shadow duration-300 ease-in-out focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
          />
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
        </div>
      </footer>
    </div>
  );
}
