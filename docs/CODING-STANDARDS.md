# Coding Standards and Best Practices

## Overview

This document outlines the coding standards and best practices for the Photo Book Creator project. Following these guidelines ensures code consistency, maintainability, and quality across the entire codebase.

## General Principles

### 1. Clean Code

Write code that is:
- **Readable**: Code should be easy to read and understand
- **Maintainable**: Code should be easy to modify and extend
- **Testable**: Code should be structured to facilitate testing
- **Reusable**: Code should be designed for reuse where appropriate

### 2. Consistency

Maintain consistency in:
- **Naming conventions**: Use consistent naming across the codebase
- **Code structure**: Follow established patterns and structures
- **Formatting**: Use consistent formatting and indentation
- **Documentation**: Document code consistently

### 3. Performance

Write efficient code that:
- **Minimizes resource usage**: Optimize for memory and CPU usage
- **Handles errors gracefully**: Implement proper error handling
- **Scales well**: Design for scalability from the start

## TypeScript Standards

### Type Safety

1. **Use TypeScript**: All code should be written in TypeScript
2. **Avoid `any`**: Minimize use of `any` type; use specific types instead
3. **Use interfaces**: Define interfaces for complex objects
4. **Generic types**: Use generics where appropriate for type safety

```typescript
// Good
interface User {
  id: string;
  email: string;
  name?: string;
}

// Avoid
const user: any = {};

// Good with generics
function useArray<T>(initialValue: T[]): [T[], (value: T) => void] {
  // Implementation
}
```

### Naming Conventions

1. **Interfaces**: Use PascalCase and prefer `I` prefix for interfaces
2. **Types**: Use PascalCase
3. **Variables**: Use camelCase
4. **Functions**: Use camelCase
5. **Constants**: Use UPPER_SNAKE_CASE
6. **Classes**: Use PascalCase
7. **Files**: Use kebab-case for file names

```typescript
// Interfaces
interface IUserService {}
interface IPhoto {}

// Types
type UserRole = 'admin' | 'user' | 'guest';

// Variables
const userName = 'John';
const isActive = true;

// Functions
function getUserById(id: string): Promise<IUser> {}

// Constants
const MAX_RETRY_ATTEMPTS = 3;

// Classes
class UserService {}

// Files
// user-service.ts
// photo-gallery.tsx
```

### Function Design

1. **Pure functions**: Prefer pure functions when possible
2. **Single responsibility**: Each function should have one clear purpose
3. **Descriptive names**: Function names should clearly describe what they do
4. **Parameter limits**: Limit function parameters to 3 or fewer

```typescript
// Good
function calculateTotalPrice(items: CartItem[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return subtotal * (1 + taxRate);
}

// Avoid - too many parameters
function processOrder(
  userId: string,
  items: CartItem[],
  shippingAddress: Address,
  billingAddress: Address,
  paymentMethod: PaymentMethod,
  discountCode: string,
  taxRate: number
): Promise<Order> {}
```

## React/Next.js Standards

### Component Structure

1. **Component organization**: Organize components logically
2. **Props interface**: Define clear prop interfaces
3. **Default exports**: Use default exports for page components
4. **Named exports**: Use named exports for reusable components

```typescript
// Good component structure
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false
}) => {
  // Component implementation
};

// Page component
export default function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Button>Click me</Button>
    </div>
  );
}
```

### Hooks

1. **Custom hooks**: Extract reusable logic into custom hooks
2. **Hook naming**: Prefix custom hooks with `use`
3. **Hook rules**: Follow React's rules of hooks

```typescript
// Good custom hook
import { useState, useEffect } from 'react';

interface UseApiOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export function useApi<T>(options: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(options.url, { method: options.method });
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options.url, options.method]);

  return { data, loading, error };
}
```

### State Management

1. **Zustand**: Use Zustand for complex state management
2. **Context API**: Use React Context for simple global state
3. **Local state**: Use useState for component-local state

```typescript
// Good Zustand store
import { create } from 'zustand';

interface DesignState {
  pages: CanvasPage[];
  currentPageIndex: number;
  addPage: () => void;
  removePage: (pageIndex: number) => void;
  setCurrentPage: (pageIndex: number) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  pages: [],
  currentPageIndex: 0,
  addPage: () => set((state) => ({
    pages: [...state.pages, createNewPage()],
    currentPageIndex: state.pages.length
  })),
  // ... other methods
}));
```

## Backend Standards

### Express.js Patterns

1. **Controller pattern**: Separate request handling from business logic
2. **Service pattern**: Encapsulate business logic in services
3. **Middleware**: Use middleware for cross-cutting concerns
4. **Error handling**: Implement consistent error handling

```typescript
// Controller
export const photoController = {
  async uploadPhoto(req: Request, res: Response) {
    try {
      const result = await photoService.uploadPhoto(
        req.file,
        req.body.name,
        req.body.albumId
      );
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }
};

// Service
export const photoService = {
  async uploadPhoto(file: Express.Multer.File, name?: string, albumId?: string) {
    // Business logic
    const uploadResult = await cloudinaryService.upload(file.buffer);
    
    const photo = await prisma.photo.create({
      data: {
        url: uploadResult.secure_url,
        name: name || file.originalname,
        size: file.size,
        type: file.mimetype,
        albumId
      }
    });
    
    return photo;
  }
};
```

### Database Design

1. **Prisma**: Use Prisma for database operations
2. **Relations**: Define clear relationships between models
3. **Indexes**: Create appropriate indexes for performance
4. **Validation**: Validate data at the application level

```prisma
// Good Prisma schema
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?
  name      String?
  photos    Photo[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

model Photo {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  url       String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

## Testing Standards

### Test Structure

1. **AAA pattern**: Arrange, Act, Assert
2. **Descriptive names**: Test names should clearly describe what is being tested
3. **Isolation**: Tests should be independent of each other
4. **Coverage**: Aim for high test coverage, especially for critical paths

```typescript
// Good test structure
describe('UserService', () => {
  describe('getUserById', () => {
    test('should return user when valid ID is provided', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = { id: userId, name: 'John Doe' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      });
    });

    test('should throw error when user is not found', async () => {
      // Arrange
      const userId = 'non-existent';
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById(userId))
        .rejects
        .toThrow('User not found');
    });
  });
});
```

### Test Types

1. **Unit tests**: Test individual functions and components
2. **Integration tests**: Test interactions between components
3. **End-to-end tests**: Test complete user workflows

```typescript
// Unit test example
test('calculateTotalPrice should calculate correct total', () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 15, quantity: 1 }
  ];
  const taxRate = 0.1;
  
  const total = calculateTotalPrice(items, taxRate);
  
  expect(total).toBe(38.5); // (10*2 + 15*1) * 1.1 = 38.5
});

// Integration test example
test('photoService should upload photo to cloudinary and save to database', async () => {
  const mockFile = { 
    buffer: Buffer.from('test'), 
    originalname: 'test.jpg',
    size: 4,
    mimetype: 'image/jpeg'
  };
  
  const mockUploadResult = { secure_url: 'http://example.com/test.jpg' };
  (cloudinaryService.upload as jest.Mock).mockResolvedValue(mockUploadResult);
  
  const result = await photoService.uploadPhoto(mockFile);
  
  expect(cloudinaryService.upload).toHaveBeenCalledWith(mockFile.buffer);
  expect(prisma.photo.create).toHaveBeenCalledWith({
    data: {
      url: 'http://example.com/test.jpg',
      name: 'test.jpg',
      size: 4,
      type: 'image/jpeg'
    }
  });
});
```

## Security Standards

### Authentication

1. **JWT**: Use JWT for stateless authentication
2. **Password hashing**: Always hash passwords with bcrypt
3. **Token expiration**: Set appropriate token expiration times
4. **Refresh tokens**: Implement refresh token rotation

```typescript
// Good authentication implementation
export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return { user, token };
  }
};
```

### Input Validation

1. **Zod**: Use Zod for input validation
2. **Sanitization**: Sanitize user inputs
3. **Rate limiting**: Implement rate limiting to prevent abuse

```typescript
// Good input validation
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100)
});

export const validateCreateUser = (data: unknown) => {
  return createUserSchema.parse(data);
};
```

### CORS and Security Headers

1. **CORS**: Configure CORS properly
2. **Security headers**: Set appropriate security headers
3. **HTTPS**: Always use HTTPS in production

```typescript
// Good CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Security headers
app.use(helmet());
```

## Performance Standards

### Database Optimization

1. **Indexes**: Create indexes on frequently queried fields
2. **Pagination**: Implement pagination for large datasets
3. **Connection pooling**: Use connection pooling
4. **Query optimization**: Optimize complex queries

```typescript
// Good pagination implementation
export const getPhotos = async (userId: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  
  const [photos, total] = await Promise.all([
    prisma.photo.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.photo.count({ where: { userId } })
  ]);
  
  return {
    photos,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
```

### Caching

1. **Redis**: Use Redis for caching
2. **Cache invalidation**: Implement proper cache invalidation
3. **Cache strategies**: Use appropriate caching strategies

```typescript
// Good caching implementation
export const getCachedUser = async (userId: string) => {
  const cacheKey = `user:${userId}`;
  const cached = await cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  await cache.set(cacheKey, user, 3600); // Cache for 1 hour
  
  return user;
};
```

## Documentation Standards

### Code Comments

1. **JSDoc**: Use JSDoc for function and class documentation
2. **Complex logic**: Comment complex business logic
3. **TODO comments**: Use TODO comments for future improvements

```typescript
/**
 * Calculates the total price including tax
 * @param items - Array of cart items
 * @param taxRate - Tax rate as a decimal (e.g., 0.1 for 10%)
 * @returns Total price including tax
 */
function calculateTotalPrice(items: CartItem[], taxRate: number): number {
  // Implementation
}
```

### README Files

1. **Project overview**: Include project overview in README
2. **Setup instructions**: Provide clear setup instructions
3. **Usage examples**: Include usage examples
4. **API documentation**: Document API endpoints

## Code Review Standards

### Review Process

1. **Pull requests**: All changes should go through pull requests
2. **Review checklist**: Use a review checklist
3. **Automated checks**: Run automated checks before review
4. **Constructive feedback**: Provide constructive feedback

### Review Checklist

- [ ] Code follows coding standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Security considerations are addressed
- [ ] Performance implications are considered
- [ ] Error handling is implemented
- [ ] Code is readable and maintainable

## Tools and Configuration

### ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  }
}
```

## Conclusion

Following these coding standards and best practices will help maintain a high-quality, consistent, and maintainable codebase. Regular code reviews and adherence to these guidelines will ensure the long-term success of the Photo Book Creator project.

Remember that these standards should evolve with the project. Regularly review and update them based on team feedback and new best practices in the industry.