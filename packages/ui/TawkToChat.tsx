'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface TawkToChatProps {
  propertyId: string;
  widgetId: string;
}

export const TawkToChat = ({ propertyId, widgetId }: TawkToChatProps) => {
  useEffect(() => {
    // Initialize Tawk_API if it doesn't exist
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.Tawk_API = window.Tawk_API || {};
      // @ts-ignore
      window.Tawk_LoadStart = new Date();
    }
  }, []);

  // Don't render anything if we're not in the browser
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <Script
      strategy="lazyOnload"
      src={`https://embed.tawk.to/${propertyId}/${widgetId}`}
    />
  );
};