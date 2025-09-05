'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';

export const ChatTrigger = () => {
  const [isChatLoaded, setIsChatLoaded] = useState(false);

  useEffect(() => {
    // Check if Tawk_API is available
    if (typeof window !== 'undefined') {
      // @ts-ignore
      if (window.Tawk_API) {
        setIsChatLoaded(true);
      }

      // Listen for Tawk_API load event
      const handleLoad = () => {
        setIsChatLoaded(true);
      };

      window.addEventListener('tawkLoad', handleLoad);

      return () => {
        window.removeEventListener('tawkLoad', handleLoad);
      };
    }
  }, []);

  const openChat = () => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      if (window.Tawk_API && window.Tawk_API.maximize) {
        // @ts-ignore
        window.Tawk_API.maximize();
      }
    }
  };

  if (!isChatLoaded) {
    return null;
  }

  return (
    <Button
      onClick={openChat}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 shadow-lg transition-all duration-300"
      aria-label="Open live chat"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
      </svg>
      <span>Chat with us</span>
    </Button>
  );
};