import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@ui/Navigation';
import { Footer } from '@ui/Footer';
import { TawkToChat } from '@ui/TawkToChat';
import { ChatTrigger } from '@ui/ChatTrigger';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Photo Book Creator',
  description: 'Create beautiful custom photo books with our easy-to-use design tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Tawk.to configuration - replace with your actual property and widget IDs
  const TAWK_TO_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_TO_PROPERTY_ID || 'YOUR_PROPERTY_ID';
  const TAWK_TO_WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_TO_WIDGET_ID || 'YOUR_WIDGET_ID';

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        {TAWK_TO_PROPERTY_ID !== 'YOUR_PROPERTY_ID' && TAWK_TO_WIDGET_ID !== 'YOUR_WIDGET_ID' && (
          <>
            <TawkToChat propertyId={TAWK_TO_PROPERTY_ID} widgetId={TAWK_TO_WIDGET_ID} />
            <ChatTrigger />
          </>
        )}
      </body>
    </html>
  );
}