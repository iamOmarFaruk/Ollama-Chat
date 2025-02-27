'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/app/lib/context';
import { FaFileAlt, FaCode, FaFileSignature, FaRobot, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WelcomeScreen() {
  const router = useRouter();
  const { createChat, currentModel, ollamaStatus } = useApp();
  
  const handleTaskClick = async (task) => {
    if (!currentModel) return;
    
    try {
      const chat = await createChat(currentModel.id);
      if (chat && chat.id) {
        // We'll navigate to the chat and the message will be pre-filled
        router.push(`/chat/${chat.id}?task=${encodeURIComponent(task)}`);
      }
    } catch (error) {
      console.error('Error creating chat with task:', error);
    }
  };
  
  const tasks = [
    { id: 'blog', icon: <FaFileAlt className="text-amber-600" size={20} />, title: 'Write blog posts' },
    { id: 'content', icon: <FaRobot className="text-green-600" size={20} />, title: 'Create content' },
    { id: 'code', icon: <FaCode className="text-purple-600" size={20} />, title: 'Write code' },
    { id: 'summary', icon: <FaFileSignature className="text-blue-600" size={20} />, title: 'Make summary' }
  ];
  
  const isDisabled = !ollamaStatus.running || !currentModel;
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Ochat</h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">
          Get started by selecting a task or type a message below to begin chatting.
        </p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {tasks.map((task) => (
            <motion.button
              key={task.id}
              variants={item}
              onClick={() => handleTaskClick(task.title)}
              disabled={isDisabled}
              className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {task.icon}
                </div>
                <span className="font-medium">{task.title}</span>
              </div>
              <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                <FaArrowRight />
              </span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
} 