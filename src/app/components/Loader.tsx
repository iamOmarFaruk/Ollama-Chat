"use client";

export const Loader = () => {
  return (
    <div className="w-full">
      {[1, 2, 3].map((item) => (
        <div key={item} className="mb-3 w-full bg-gray-100 dark:bg-gray-800 rounded-md p-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-3 w-1/3 bg-gray-300 dark:bg-gray-600 rounded mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};