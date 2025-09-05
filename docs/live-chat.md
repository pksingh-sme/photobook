# Live Chat Support Integration Documentation

## Overview

This document describes the live chat support implementation for the Photo Book Creator application. The live chat feature allows users to get real-time assistance from customer support representatives.

## Technology Stack

- **Tawk.to** - Third-party live chat service
- **Custom Chat Widget** - Alternative self-hosted solution
- **Socket.io** - Real-time communication library (for custom implementation)

## Implementation Options

### Option 1: Tawk.to Integration (Recommended)

#### Setup Process

1. **Create Tawk.to Account**
   - Sign up at [https://www.tawk.to](https://www.tawk.to)
   - Create a new property for Photo Book Creator
   - Configure chat widget settings

2. **Get Widget Script**
   ```javascript
   // Tawk.to widget script
   var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
   (function(){
   var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
   s1.async=true;
   s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
   s1.charset='UTF-8';
   s1.setAttribute('crossorigin','*');
   s0.parentNode.insertBefore(s1,s0);
   })();
   ```

3. **Environment Configuration**
   Add the following environment variables to your `.env.local` file:
   ```bash
   NEXT_PUBLIC_TAWK_TO_PROPERTY_ID=your_tawkto_property_id
   NEXT_PUBLIC_TAWK_TO_WIDGET_ID=your_tawkto_widget_id
   ```

4. **Component Implementation**
   The Tawk.to integration consists of two components:
   
   a. **TawkToChat Component** - Handles the script loading
   ```typescript
   // packages/ui/TawkToChat.tsx
   'use client';

   import Script from 'next/script';
   import { useEffect } from 'react';

   interface TawkToChatProps {
     propertyId: string;
     widgetId: string;
   }

   export const TawkToChat = ({ propertyId, widgetId }: TawkToChatProps) => {
     useEffect(() => {
       // @ts-ignore
       window.Tawk_API = window.Tawk_API || {};
       // @ts-ignore
       window.Tawk_LoadStart = new Date();
     }, []);

     return (
       <Script
         strategy="lazyOnload"
         src={`https://embed.tawk.to/${propertyId}/${widgetId}`}
       />
     );
   };
   ```
   
   b. **ChatTrigger Component** - Provides a user-friendly button to open the chat
   ```typescript
   // packages/ui/ChatTrigger.tsx
   'use client';

   import { useState, useEffect } from 'react';
   import { Button } from './Button';

   export const ChatTrigger = () => {
     const [isChatLoaded, setIsChatLoaded] = useState(false);

     useEffect(() => {
       // Check if Tawk_API is available
       // @ts-ignore
       if (typeof window !== 'undefined' && window.Tawk_API) {
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
     }, []);

     const openChat = () => {
       // @ts-ignore
       if (window.Tawk_API) {
         // @ts-ignore
         window.Tawk_API.maximize();
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
   ```

5. **Integration with Next.js Layout**
   The components are integrated into the root layout:
   ```typescript
   // apps/frontend/app/layout.tsx
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
   ```

6. **Component Export**
   The components are exported from the UI package:
   ```typescript
   // packages/ui/index.ts
   export * from './Button';
   export * from './Navigation';
   export * from './LoadingSpinner';
   export * from './Modal';
   export * from './Footer';
   export * from './SearchBar';
   export * from './Pagination';
   export * from './Alert';
   export * from './Breadcrumb';
   export * from './Card';
   export * from './Tabs';
   export * from './Dropdown';
   export * from './TawkToChat';
   export * from './ChatTrigger';
   ```

### Option 2: Custom Live Chat Implementation

#### Backend Setup

```typescript
// apps/backend/src/services/chatService.ts
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class ChatService {
  private io: Server;
  private pubClient: any;
  private subClient: any;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    // Setup Redis adapter for multi-server support
    this.pubClient = createClient({ host: 'localhost', port: 6379 });
    this.subClient = this.pubClient.duplicate();
    
    Promise.all([
      this.pubClient.connect(),
      this.subClient.connect()
    ]).then(() => {
      this.io.adapter(createAdapter(this.pubClient, this.subClient));
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id);

      // Join chat room
      socket.on('join_chat', (data) => {
        socket.join(data.room);
        this.io.to(data.room).emit('user_joined', {
          userId: socket.id,
          username: data.username,
          timestamp: new Date()
        });
      });

      // Handle messages
      socket.on('send_message', (data) => {
        this.io.to(data.room).emit('receive_message', {
          userId: socket.id,
          username: data.username,
          message: data.message,
          timestamp: new Date()
        });
      });

      // Handle typing indicators
      socket.on('typing', (data) => {
        socket.to(data.room).emit('user_typing', {
          userId: socket.id,
          username: data.username
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  public getIO() {
    return this.io;
  }
}
```

#### Frontend Implementation

```typescript
// apps/frontend/lib/chatClient.ts
import { io, Socket } from 'socket.io-client';

class ChatClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  public connect() {
    this.socket = io(process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:4000');

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.emit('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.emit('disconnected');
    });

    this.socket.on('receive_message', (data) => {
      this.emit('message_received', data);
    });

    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    this.socket.on('user_joined', (data) => {
      this.emit('user_joined', data);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public joinChat(room: string, username: string) {
    if (this.socket) {
      this.socket.emit('join_chat', { room, username });
    }
  }

  public sendMessage(room: string, username: string, message: string) {
    if (this.socket) {
      this.socket.emit('send_message', { room, username, message });
    }
  }

  public sendTyping(room: string, username: string) {
    if (this.socket) {
      this.socket.emit('typing', { room, username });
    }
  }

  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public off(event: string, callback: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
}

export const chatClient = new ChatClient();
```

#### Chat Component

```typescript
// apps/frontend/components/ChatWidget.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { chatClient } from '@/lib/chatClient';

interface Message {
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

interface TypingUser {
  userId: string;
  username: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatClient.connect();
      chatClient.joinChat('support', username || 'Anonymous');
      
      chatClient.on('message_received', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });
      
      chatClient.on('user_typing', (data: TypingUser) => {
        setTypingUsers(prev => [...prev, data]);
        // Remove typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
        }, 3000);
      });
    } else {
      chatClient.disconnect();
    }

    return () => {
      chatClient.disconnect();
    };
  }, [isOpen, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && username) {
      chatClient.sendMessage('support', username, newMessage);
      setNewMessage('');
    }
  };

  const handleTyping = () => {
    if (username) {
      chatClient.sendTyping('support', username);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Open live chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col border border-gray-200">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-medium">Live Chat Support</h3>
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Welcome to live chat support!</p>
            <p className="text-sm mt-2">How can we help you today?</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.userId === 'system' ? 'justify-center' : msg.userId === chatClient['socket']?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-lg p-3 ${msg.userId === 'system' ? 'bg-gray-100 text-gray-500 text-sm' : msg.userId === chatClient['socket']?.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {msg.userId !== 'system' && msg.userId !== chatClient['socket']?.id && (
                    <div className="font-medium text-xs mb-1">{msg.username}</div>
                  )}
                  <div>{msg.message}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {typingUsers.length > 0 && (
          <div className="flex items-center mt-2">
            <div className="text-sm text-gray-500">
              {typingUsers.map(user => user.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 p-4">
        {!username ? (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && username && chatClient.joinChat('support', username)}
            />
            <button
              onClick={() => username && chatClient.joinChat('support', username)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              disabled={!username}
            >
              Start Chat
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                } else {
                  handleTyping();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CHAT_URL=http://localhost:4000
NEXT_PUBLIC_TAWKTO_PROPERTY_ID=your_tawkto_property_id
```

### Backend Configuration

```typescript
// apps/backend/src/index.ts
import express from 'express';
import { createServer } from 'http';
import { ChatService } from './services/chatService';

const app = express();
const server = createServer(app);

// Initialize chat service
const chatService = new ChatService(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Security Considerations

### 1. Authentication
- Implement user authentication for chat sessions
- Validate user identity before allowing chat access

### 2. Rate Limiting
- Implement rate limiting for message sending
- Prevent spam and abuse of chat functionality

### 3. Content Filtering
- Implement profanity filtering
- Moderate inappropriate content

### 4. Data Privacy
- Encrypt chat messages in transit
- Comply with data protection regulations (GDPR, CCPA)

## Performance Optimization

### 1. Connection Management
- Implement connection pooling
- Handle connection timeouts gracefully

### 2. Message Storage
- Use efficient database storage for chat history
- Implement message retention policies

### 3. Scalability
- Use Redis adapter for multi-server deployments
- Implement load balancing for chat servers

## Analytics Integration

### Tracking Chat Events

```typescript
// lib/analytics.ts
export const trackChatEvent = (event: string, data: any) => {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, data);
  }

  // Custom analytics
  fetch('/api/analytics/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event,
      data,
      timestamp: new Date().toISOString(),
    }),
  });
};
```

### Integration with Chat Components

```typescript
// In chat components
useEffect(() => {
  trackChatEvent('chat_opened', { userId });
}, []);

const handleSendMessage = () => {
  if (newMessage.trim()) {
    chatClient.sendMessage('support', username, newMessage);
    trackChatEvent('message_sent', { userId, messageLength: newMessage.length });
    setNewMessage('');
  }
};
```

## Testing

### Unit Tests

```typescript
// __tests__/chatClient.test.ts
import { chatClient } from '../lib/chatClient';

jest.mock('socket.io-client', () => {
  const emit = jest.fn();
  const on = jest.fn();
  const disconnect = jest.fn();
  
  return {
    io: jest.fn(() => ({
      emit,
      on,
      disconnect,
    })),
  };
});

describe('ChatClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to chat server', () => {
    chatClient.connect();
    expect(chatClient['socket']).toBeDefined();
  });

  it('should send messages', () => {
    chatClient.connect();
    chatClient.sendMessage('support', 'testuser', 'Hello');
    expect(chatClient['socket']?.emit).toHaveBeenCalledWith('send_message', {
      room: 'support',
      username: 'testuser',
      message: 'Hello',
    });
  });

  it('should handle message events', () => {
    const mockCallback = jest.fn();
    chatClient.on('message_received', mockCallback);
    
    // Simulate receiving a message
    chatClient['emit']('message_received', { message: 'Test message' });
    
    expect(mockCallback).toHaveBeenCalledWith({ message: 'Test message' });
  });
});
```

## Accessibility

### 1. Keyboard Navigation
- Ensure all chat controls are keyboard accessible
- Implement proper focus management

### 2. Screen Reader Support
- Add ARIA labels for chat elements
- Provide status updates for screen readers

### 3. Color Contrast
- Ensure sufficient color contrast for chat text
- Provide high contrast mode option

## Deployment

### Production Configuration

```bash
# Dockerfile for chat server
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  chat:
    build: ./apps/backend
    ports:
      - "4000:4000"
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

## Monitoring and Maintenance

### 1. Health Checks
- Implement health check endpoints
- Monitor connection counts and message throughput

### 2. Logging
- Log chat events for debugging
- Implement structured logging

### 3. Error Handling
- Gracefully handle connection errors
- Implement retry mechanisms

## Future Enhancements

### 1. AI-Powered Chatbots
- Integrate AI chatbots for common queries
- Implement natural language processing

### 2. File Sharing
- Allow users to share images and files in chat
- Implement secure file upload and storage

### 3. Chat History
- Store and retrieve chat history
- Implement search functionality for past conversations

### 4. Multi-language Support
- Translate chat messages in real-time
- Support multiple languages in chat interface