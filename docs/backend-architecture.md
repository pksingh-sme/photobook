# Backend Architecture

## Overview

The Photo Book Creator backend is built with Node.js and Express.js, providing a robust RESTful API for the frontend application. This document details the backend architecture, including folder structure, design patterns, security measures, and best practices.

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Payment Processing**: Stripe
- **Validation**: Zod
- **Testing**: Jest, Supertest
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Docker, PM2

## Folder Structure

```
apps/backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   ├── lib/              # Utility functions and configurations
│   ├── prisma/           # Prisma schema and client
│   ├── types/            # TypeScript types
│   ├── utils/            # Helper functions
│   ├── config/           # Configuration files
│   └── index.ts          # Application entry point
├── tests/                # Test files
├── docs/                 # API documentation
├── prisma/               # Prisma schema files
├── Dockerfile            # Docker configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── .env                  # Environment variables
```

## Architecture Patterns

### Layered Architecture

The backend follows a layered architecture pattern with clear separation of concerns:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Implement business logic
3. **Data Access**: Prisma ORM for database operations
4. **Middleware**: Cross-cutting concerns (authentication, validation, etc.)

### Controller Layer

Controllers handle incoming HTTP requests and return appropriate responses:

```typescript
// src/controllers/authController.ts
import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register(email, password, name);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
};
```

### Service Layer

Services contain business logic and interact with the data layer:

```typescript
// src/services/authService.ts
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authService = {
  async register(email: string, password: string, name: string) {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    };
  },

  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    // Validate password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    };
  }
};
```

## API Design

### RESTful Principles

The API follows RESTful principles:

1. **Resource-based URLs**: `/api/users`, `/api/photos`, `/api/designs`
2. **HTTP Methods**: GET, POST, PUT, DELETE
3. **Stateless**: Each request contains all necessary information
4. **Cacheable**: Responses can be cached when appropriate

### API Endpoints

#### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

#### Photos

```
POST /api/photos
GET /api/photos
GET /api/photos/:id
DELETE /api/photos/:id
```

#### Albums

```
POST /api/albums
GET /api/albums
GET /api/albums/:id
PUT /api/albums/:id
DELETE /api/albums/:id
```

#### Designs

```
POST /api/designs
GET /api/designs
GET /api/designs/:id
PUT /api/designs/:id
DELETE /api/designs/:id
```

#### Products

```
GET /api/products
GET /api/products/:id
GET /api/products/categories
```

#### Orders

```
POST /api/orders
GET /api/orders
GET /api/orders/:id
```

#### Addresses

```
POST /api/addresses
GET /api/addresses
GET /api/addresses/:id
PUT /api/addresses/:id
DELETE /api/addresses/:id
```

### Request/Response Format

#### Success Response

```json
{
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

#### Error Response

```json
{
  "message": "Error description",
  "error": "Error details (optional)"
}
```

## Middleware

### Authentication Middleware

JWT-based authentication middleware:

```typescript
// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
```

### Validation Middleware

Request validation using Zod:

```typescript
// src/middleware/validationMiddleware.ts
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors
      });
    }
  };
};
```

### Error Handling Middleware

Centralized error handling:

```typescript
// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};
```

## Database Design

### Prisma ORM

Prisma is used as the database ORM with the following key features:

1. **Type Safety**: Full TypeScript support
2. **Migrations**: Database schema migrations
3. **Relations**: Automatic relation handling
4. **Query Builder**: Intuitive query building

### Example Prisma Schema

```prisma
// prisma/schema.prisma
model User {
  id            String     @id @default(cuid())
  email         String     @unique
  password      String?
  name          String?
  photos        Photo[]
  designs       Design[]
  orders        Order[]
  addresses     Address[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Photo {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  url       String
  name      String?
  size      Int?
  type      String?
  albumId   String?
  album     Album?   @relation(fields: [albumId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## File Storage

### Cloudinary Integration

Cloudinary is used for image storage and processing:

```typescript
// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (buffer: Buffer, folder: string = 'photos') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    uploadStream.end(buffer);
  });
};
```

## Payment Processing

### Stripe Integration

Stripe is used for payment processing:

```typescript
// src/services/paymentService.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export const paymentService = {
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      }
    });
  },

  async confirmPayment(paymentIntentId: string, paymentMethodId: string) {
    return await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId
    });
  }
};
```

## Security

### Authentication

JWT-based authentication with secure practices:

1. **Strong Secret**: Use a strong, randomly generated secret
2. **Expiration**: Set appropriate token expiration times
3. **HTTPS**: Always use HTTPS in production
4. **Refresh Tokens**: Implement refresh token rotation

### Input Validation

Zod is used for input validation:

```typescript
// src/validation/photoValidation.ts
import { z } from 'zod';

export const createPhotoSchema = z.object({
  name: z.string().min(1).max(255),
  albumId: z.string().optional()
});

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;
```

### Rate Limiting

Express-rate-limit is used for rate limiting:

```typescript
// src/middleware/rateLimitMiddleware.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
```

### CORS Configuration

Secure CORS configuration:

```typescript
// src/config/cors.ts
import cors from 'cors';

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000'
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
```

## Logging

### Structured Logging

Winston is used for structured logging:

```typescript
// src/lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

## Testing

### Unit Testing

Jest is used for unit testing:

```typescript
// src/services/authService.test.ts
import { authService } from './authService';
import { prisma } from '../lib/prisma';

jest.mock('../lib/prisma');

describe('authService', () => {
  describe('register', () => {
    test('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-1',
        ...userData,
        password: 'hashed-password'
      });

      const result = await authService.register(
        userData.email,
        userData.password,
        userData.name
      );

      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
    });
  });
});
```

### Integration Testing

Supertest is used for API integration testing:

```typescript
// tests/integration/photo.test.ts
import request from 'supertest';
import app from '../../src/index';
import { prisma } from '../../src/lib/prisma';

describe('Photo API', () => {
  describe('POST /api/photos', () => {
    test('should upload a photo', async () => {
      const photoData = {
        name: 'test-photo.jpg',
        url: 'http://example.com/test-photo.jpg'
      };

      (prisma.photo.create as jest.Mock).mockResolvedValue({
        id: 'photo-1',
        userId: 'user-1',
        ...photoData
      });

      const response = await request(app)
        .post('/api/photos')
        .set('Authorization', 'Bearer valid-token')
        .send(photoData);

      expect(response.status).toBe(201);
      expect(response.body.photo.name).toBe(photoData.name);
    });
  });
});
```

## API Documentation

### Swagger/OpenAPI

Swagger is used for API documentation:

```typescript
// src/docs/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Photo Book Creator API',
      version: '1.0.0',
      description: 'API documentation for the Photo Book Creator application'
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/docs/*.yaml']
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
```

## Performance Optimization

### Database Connection Pooling

Prisma connection pooling for database performance:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error']
});

export { prisma };
```

### Caching

Redis is used for caching frequently accessed data:

```typescript
// src/lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get(key: string) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttl: number = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string) {
    await redis.del(key);
  }
};
```

### Compression

Express compression middleware for response compression:

```typescript
// src/index.ts
import compression from 'compression';

app.use(compression());
```

## Monitoring and Health Checks

### Health Check Endpoint

```typescript
// src/routes/healthRoutes.ts
import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
```

### Application Metrics

Prometheus integration for application metrics:

```typescript
// src/middleware/metricsMiddleware.ts
import client from 'prom-client';

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    }, duration);
  });
  
  next();
};
```

## Deployment

### Docker Configuration

Dockerfile for containerization:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
```

### Environment Configuration

Environment-specific configuration:

```bash
# .env.production
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
STRIPE_SECRET_KEY=sk_live_your-stripe-key
```

### Process Management

PM2 configuration for production:

```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'photobook-api',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

## Error Handling and Recovery

### Graceful Shutdown

Proper application shutdown handling:

```typescript
// src/lib/shutdown.ts
import { prisma } from './prisma';

const shutdown = async () => {
  console.log('Shutting down gracefully...');
  
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

### Retry Logic

Retry mechanisms for external services:

```typescript
// src/lib/retry.ts
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
};
```

## Best Practices

### Code Organization

1. **Separation of Concerns**: Keep controllers, services, and data access layers separate
2. **Single Responsibility**: Each function should have one clear purpose
3. **Consistent Naming**: Use consistent naming conventions across the codebase
4. **Documentation**: Document complex business logic and API endpoints

### Security

1. **Input Validation**: Validate all inputs using Zod or similar libraries
2. **Authentication**: Use JWT with secure practices
3. **Authorization**: Implement proper role-based access control
4. **Data Encryption**: Encrypt sensitive data at rest and in transit
5. **Rate Limiting**: Implement rate limiting to prevent abuse

### Performance

1. **Database Indexes**: Create appropriate indexes for frequently queried fields
2. **Connection Pooling**: Use connection pooling for database connections
3. **Caching**: Implement caching for frequently accessed data
4. **Pagination**: Implement pagination for large datasets
5. **Compression**: Use compression for API responses

### Monitoring

1. **Logging**: Implement structured logging with appropriate log levels
2. **Metrics**: Collect and expose application metrics
3. **Health Checks**: Implement health check endpoints
4. **Error Tracking**: Use tools like Sentry for error tracking
5. **Alerting**: Set up alerts for critical issues

### Testing

1. **Unit Tests**: Write unit tests for all business logic
2. **Integration Tests**: Test API endpoints and database interactions
3. **End-to-End Tests**: Test complete user workflows
4. **Test Coverage**: Maintain high test coverage for critical functionality
5. **CI/CD Integration**: Run tests in CI/CD pipeline

This backend architecture provides a robust, scalable, and maintainable foundation for the Photo Book Creator application, following industry best practices and security standards.