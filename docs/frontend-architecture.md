# Frontend Architecture

## Overview

The Photo Book Creator frontend is built with Next.js 14+ using the App Router, providing a modern, performant, and scalable architecture. This document details the frontend architecture, including folder structure, state management, component organization, and best practices.

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Image Processing**: Fabric.js
- **Testing**: Jest, React Testing Library, Playwright
- **Build Tool**: Webpack (via Next.js)
- **Package Manager**: npm/pnpm

## Folder Structure

```
apps/frontend/
├── app/                    # App Router pages and layouts
│   ├── (auth)/            # Authentication routes (login, register, etc.)
│   ├── (dashboard)/       # Dashboard routes
│   ├── design/            # Photo book designer
│   ├── gallery/           # Photo gallery
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── account/           # Account management
│   ├── orders/            # Order management
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Shared components
├── lib/                   # Utility functions and services
│   ├── api.ts             # API service
│   ├── store.ts           # Zustand store
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utility functions
├── public/                # Static assets
├── styles/                # Global style files
├── tests/                 # Test files
├── types/                 # TypeScript types
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Package dependencies
```

## App Router Structure

The application uses Next.js App Router with route groups for better organization:

### Route Groups

- **(auth)**: Authentication-related pages (login, register, forgot password)
- **(dashboard)**: User dashboard and related pages
- **(admin)**: Admin-only pages

### Key Routes

1. **/**: Homepage
2. **/design**: Photo book designer
3. **/gallery**: Photo management
4. **/products**: Product listing
5. **/products/[id]**: Product detail
6. **/cart**: Shopping cart
7. **/checkout**: Checkout process
8. **/dashboard**: User dashboard
9. **/account**: Account settings
10. **/orders**: Order history
11. **/admin**: Admin dashboard

## State Management

### Zustand Store

The application uses Zustand for state management, providing a simple and scalable solution.

#### Design Store

```typescript
// lib/store.ts
interface DesignState {
  design: PhotoBookDesign;
  currentPageIndex: number;
  addPage: () => void;
  removePage: (pageIndex: number) => void;
  setCurrentPage: (pageIndex: number) => void;
  updatePage: (pageIndex: number, page: CanvasPage) => void;
  updateDesignSettings: (settings: Partial<PhotoBookDesign['settings']>) => void;
}
```

#### Store Best Practices

1. **Separation of Concerns**: Each store manages a specific domain
2. **Immutability**: Always return new objects/arrays instead of mutating existing ones
3. **Selectors**: Use selectors for complex state derivations
4. **Middleware**: Implement middleware for logging, persistence, etc.

### Context API

For global state that doesn't require complex logic, React Context API is used:

```typescript
// lib/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}
```

## Component Architecture

### UI Component Library

Shared components are organized in the `packages/ui` directory:

```
packages/ui/
├── Button.tsx
├── Navigation.tsx
├── Footer.tsx
├── LoadingSpinner.tsx
├── Modal.tsx
├── Card.tsx
├── Form.tsx
├── Input.tsx
├── Select.tsx
└── index.ts
```

### Component Design Principles

1. **Reusability**: Components should be generic and reusable
2. **Composition**: Favor composition over inheritance
3. **Props Interface**: Define clear prop interfaces with TypeScript
4. **Accessibility**: Implement proper ARIA attributes and keyboard navigation
5. **Styling**: Use Tailwind CSS utility classes for consistent styling

### Example Component

```typescript
// packages/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  as?: 'button' | 'span';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
```

## Data Fetching

### API Service Layer

The application uses a centralized API service for all HTTP requests:

```typescript
// lib/api.ts
export const api = {
  auth: {
    login: (email: string, password: string) => Promise<AuthResponse>,
    register: (email: string, password: string, name: string) => Promise<AuthResponse>
  },
  photos: {
    upload: (file: File) => Promise<Photo>,
    getAll: () => Promise<Photo[]>,
    delete: (id: string) => Promise<void>
  },
  designs: {
    create: (data: DesignData) => Promise<Design>,
    update: (id: string, data: DesignData) => Promise<Design>,
    getAll: () => Promise<Design[]>
  }
};
```

### React Query Integration

For server state management, React Query is used:

```typescript
// lib/hooks/usePhotos.ts
import { useQuery } from '@tanstack/react-query';
import { photoApi } from '@/lib/api';

export const usePhotos = () => {
  return useQuery(['photos'], () => photoApi.getPhotos());
};
```

## Styling

### Tailwind CSS

The application uses Tailwind CSS for styling with a custom configuration:

```typescript
// tailwind.config.ts
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './packages/ui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb'
        }
      }
    }
  },
  plugins: []
};
```

### Responsive Design

Mobile-first responsive design using Tailwind's breakpoints:

```tsx
// Example responsive component
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>
```

## Image Processing

### Fabric.js Integration

The photo book designer uses Fabric.js for canvas manipulation:

```typescript
// app/design/page.tsx
import { fabric } from 'fabric';

const initializeCanvas = () => {
  const canvas = new fabric.Canvas('canvas', {
    width: 800,
    height: 600,
    backgroundColor: '#ffffff'
  });
  
  // Add event listeners
  canvas.on('object:modified', (e) => {
    // Handle object modification
  });
  
  return canvas;
};
```

### Performance Optimization

1. **Lazy Loading**: Load Fabric.js only on the design page
2. **Canvas Cleanup**: Properly dispose of canvas instances
3. **Image Optimization**: Use compressed images for previews

## Routing

### Dynamic Routes

Dynamic routes are used for product details, design editing, etc.:

```typescript
// app/products/[id]/page.tsx
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // Fetch product by params.id
}
```

### Route Protection

Middleware is used to protect authenticated routes:

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/login'
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*']
};
```

## Internationalization (i18n)

### Multi-language Support

The application supports multiple languages using next-i18next:

```typescript
// lib/i18n.ts
import { appWithTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getI18nProps = async (locale: string, namespaces: string[] = ['common']) => {
  return {
    ...(await serverSideTranslations(locale, namespaces))
  };
};
```

## Performance Optimization

### Code Splitting

Next.js automatically code-splits by route, but additional optimization can be done:

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});
```

### Image Optimization

Next.js Image component for optimized image loading:

```tsx
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="/photo-blur.jpg"
/>
```

### Bundle Analysis

Regular bundle analysis to identify optimization opportunities:

```bash
npm run build
npm run analyze
```

## Testing Strategy

### Unit Testing

Components and hooks are tested with React Testing Library:

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Integration Testing

API services and hooks are tested with mocked data:

```typescript
// lib/hooks/usePhotos.test.ts
import { renderHook } from '@testing-library/react';
import { usePhotos } from './usePhotos';

jest.mock('@/lib/api');

test('fetches photos successfully', async () => {
  const { result, waitFor } = renderHook(() => usePhotos());
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
```

### End-to-End Testing

Playwright is used for end-to-end testing:

```typescript
// tests/e2e/design.spec.ts
import { test, expect } from '@playwright/test';

test('user can add photo to design', async ({ page }) => {
  await page.goto('/design');
  await page.click('[data-testid="add-photo-button"]');
  // Assert photo is added to canvas
});
```

## Error Handling

### Error Boundaries

React error boundaries for graceful error handling:

```tsx
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
```

### API Error Handling

Centralized error handling for API requests:

```typescript
// lib/api.ts
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};
```

## Security

### Authentication

NextAuth.js is used for authentication:

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      // Configuration
    })
  ],
  callbacks: {
    // Session and JWT callbacks
  }
});
```

### Content Security Policy

CSP headers for XSS protection:

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
          }
        ]
      }
    ];
  }
};
```

## Deployment

### Environment Configuration

Environment-specific configuration:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Build Optimization

Next.js build optimization:

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com']
  },
  experimental: {
    appDir: true
  }
};
```

## Monitoring and Analytics

### Error Tracking

Sentry integration for error tracking:

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0
});
```

### Performance Monitoring

Web Vitals monitoring:

```typescript
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};
```

## Best Practices

### Code Organization

1. **Separation of Concerns**: Keep business logic separate from UI components
2. **Consistent Naming**: Use consistent naming conventions across the codebase
3. **Type Safety**: Use TypeScript interfaces and types for all data structures
4. **Documentation**: Document complex components and functions

### Performance

1. **Lazy Loading**: Load components and data only when needed
2. **Memoization**: Use React.memo and useMemo for performance optimization
3. **Bundle Splitting**: Split large bundles into smaller chunks
4. **Image Optimization**: Use next/image for optimized image loading

### Accessibility

1. **Semantic HTML**: Use proper HTML elements for content
2. **ARIA Attributes**: Implement ARIA attributes for complex components
3. **Keyboard Navigation**: Ensure all functionality is accessible via keyboard
4. **Screen Reader Support**: Test with screen readers

### Testing

1. **Test Coverage**: Maintain high test coverage for critical functionality
2. **Mocking**: Properly mock external dependencies in tests
3. **CI/CD Integration**: Run tests in CI/CD pipeline
4. **Performance Testing**: Regular performance testing

This frontend architecture provides a solid foundation for building a scalable, maintainable, and performant photo book creation application.