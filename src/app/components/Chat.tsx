"use client";

// -------------------- Imports --------------------
import { useState, useRef, useEffect } from "react";
import { StatusWarning } from "./StatusWarning";
import { ModelSelector } from "./ModelSelector";
import { CodeBlock } from "./CodeBlock";
import { Welcome } from "./Welcome";



// -------------------- Main Chat Component --------------------
export default function Chat() {
 
 
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);



  // -------------------- 🔹 UI তে পুরনো মেসেজ দেখানো --------------------
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <main className="flex-1 overflow-y-auto p-4">
        <h3>Dynamic data and chat details will disaply here</h3>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad assumenda ducimus ratione, recusandae quis dolores debitis perferendis minima commodi veniam enim, alias dolore qui doloremque odio accusantium modi, perspiciatis impedit.</p>
      </main>

      
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="container mx-auto flex gap-4 items-center max-w-[90vw]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base min-h-[60px] max-h-[200px] resize-none overflow-y-auto shadow-sm transition-shadow duration-300 ease-in-out focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"></textarea>
        </div>
      </footer>
    </div>
  );
}
