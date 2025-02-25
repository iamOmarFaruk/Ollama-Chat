"use client";

import React from "react";

export const ChatLoader = () => {
  // Generate random number of skeletons between 4-7
  const skeletonCount = Math.floor(Math.random() * 4) + 4;
  
  return (
    <div className="flex flex-col space-y-4 overflow-hidden">
      {[...Array(skeletonCount)].map((_, index) => (
        <div 
          key={index} 
          className="flex flex-col rounded-lg bg-gray-800 p-2 animate-pulse"
        >
          <div className="flex items-start mb-1">
            {/* Avatar and message container */}
            <div className="flex-shrink-0 mr-3">
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
                <svg 
                  className="w-4 h-4 text-gray-500 animate-spin" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            </div>
            
            <div className="flex-1">
              {/* Chat header with date */}
              <div className="flex justify-between items-center mb-2">
                <div className="h-3 bg-gray-700 rounded w-24"></div>
               
              </div>
              
              {/* Message preview - random number of lines */}
              <div className="space-y-1">
                {[...Array(Math.floor(Math.random() * 2) + 1)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-2 bg-gray-700 rounded"
                    style={{width: `${Math.floor(Math.random() * 50 + 50)}%`}}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Add a timestamp effect */}
          <div className="flex mt-1">
            <div className="ml-10">
              <div className="h-2 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Alternative export if you prefer the original name
export const Loader = ChatLoader;