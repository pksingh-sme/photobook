# Testing Guide

## Overview

This guide provides comprehensive information about testing the Photo Book Creator application. The application includes unit tests, integration tests, and end-to-end tests to ensure quality and reliability.

## Testing Strategy

### Test Types

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test interactions between components and services
3. **End-to-End Tests**: Test complete user workflows
4. **Performance Tests**: Test application performance under load
5. **Security Tests**: Test for vulnerabilities and security issues

### Test Coverage Goals

- Unit test coverage: 80%+
- Integration test coverage: 70%+
- End-to-end test coverage: 60%+ for critical user flows

## Running Tests

### Prerequisites

Before running tests, ensure you have:

1. All dependencies installed (`npm install`)
2. Test database configured
3. Environment variables set for testing

### Test Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test files
npm test -- path/to/test/file.test.ts

# Run tests for a specific package
npm run test:frontend
npm run test:backend
```

## Frontend Testing

### Unit Tests

Frontend unit tests use Jest and React Testing Library to test components and hooks.

#### Testing Components

```javascript
// Example component test
import { render, screen } from '@testing-library/react';
import Button from '@ui/Button';

describe('Button', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Testing Hooks

```javascript
// Example hook test
import { renderHook, act } from '@testing-library/react';
import { useDesignStore } from '@/lib/store';

describe('useDesignStore', () => {
  test('initializes with default values', () => {
    const { result } = renderHook(() => useDesignStore());
    
    expect(result.current.design.pages).toHaveLength(1);
    expect(result.current.currentPageIndex).toBe(0);
  });

  test('adds a new page', () => {
    const { result } = renderHook(() => useDesignStore());
    
    act(() => {
      result.current.addPage();
    });
    
    expect(result.current.design.pages).toHaveLength(2);
  });
});
```

### Integration Tests

Frontend integration tests verify that components work correctly with API services.

```javascript
// Example integration test
import { render, screen, waitFor } from '@testing-library/react';
import { photoApi } from '@/lib/api';
import GalleryPage from '@/app/gallery/page';

jest.mock('@/lib/api');

describe('GalleryPage', () => {
  test('displays photos from API', async () => {
    const mockPhotos = [
      { id: '1', name: 'Photo 1', url: 'http://example.com/1.jpg' },
      { id: '2', name: 'Photo 2', url: 'http://example.com/2.jpg' }
    ];
    
    (photoApi.getPhotos as jest.Mock).mockResolvedValue(mockPhotos);
    
    render(<GalleryPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Photo 1')).toBeInTheDocument();
      expect(screen.getByText('Photo 2')).toBeInTheDocument();
    });
  });
});
```

### End-to-End Tests

Frontend end-to-end tests use Playwright or Cypress to test complete user workflows.

```javascript
// Example E2E test with Playwright
import { test, expect } from '@playwright/test';

test('user can create and save a design', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // Navigate to designer
  await page.click('text=Create Design');
  
  // Add a photo to the canvas
  await page.dragAndDrop('[data-testid="photo-item"]', '[data-testid="canvas"]');
  
  // Save the design
  await page.click('button:has-text("Save")');
  await page.fill('input[name="name"]', 'My Design');
  await page.click('button:has-text("Save Design")');
  
  // Verify success message
  await expect(page.locator('text=Design saved successfully')).toBeVisible();
});
```

## Backend Testing

### Unit Tests

Backend unit tests focus on testing individual functions and services.

```javascript
// Example unit test for a service
import { createDesign } from '../src/services/designService';
import { prisma } from '../src/lib/prisma';

jest.mock('../src/lib/prisma');

describe('designService', () => {
  describe('createDesign', () => {
    test('creates a design in the database', async () => {
      const mockDesign = {
        id: 'design-1',
        userId: 'user-1',
        name: 'Test Design',
        data: {},
        isPublic: false
      };
      
      (prisma.design.create as jest.Mock).mockResolvedValue(mockDesign);
      
      const result = await createDesign({
        userId: 'user-1',
        name: 'Test Design',
        data: {},
        isPublic: false
      });
      
      expect(result).toEqual(mockDesign);
      expect(prisma.design.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          name: 'Test Design',
          data: {},
          isPublic: false
        }
      });
    });
  });
});
```

### Integration Tests

Backend integration tests verify API endpoints and database interactions.

```javascript
// Example integration test
import request from 'supertest';
import app from '../src/index';
import { prisma } from '../src/lib/prisma';

describe('Photo API', () => {
  describe('POST /api/photos', () => {
    test('uploads a photo successfully', async () => {
      const mockPhoto = {
        id: 'photo-1',
        userId: 'user-1',
        url: 'http://example.com/photo.jpg',
        name: 'test.jpg'
      };
      
      (prisma.photo.create as jest.Mock).mockResolvedValue(mockPhoto);
      
      const response = await request(app)
        .post('/api/photos')
        .set('Authorization', 'Bearer valid-token')
        .attach('photo', Buffer.from('fake-image-data'), 'test.jpg');
      
      expect(response.status).toBe(201);
      expect(response.body.photo).toEqual(mockPhoto);
    });
  });
});
```

### API Contract Tests

API contract tests ensure that the API behaves according to its specification.

```javascript
// Example contract test
import { test, expect } from '@playwright/test';

test('GET /api/products returns products in correct format', async ({ request }) => {
  const response = await request.get('/api/products');
  
  expect(response.status()).toBe(200);
  
  const products = await response.json();
  
  // Validate response structure
  expect(Array.isArray(products)).toBe(true);
  
  if (products.length > 0) {
    const product = products[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(typeof product.price).toBe('number');
  }
});
```

## Test Environment Setup

### Test Database

Create a separate database for testing to avoid affecting production data.

```bash
# Create test database
createdb photobook_test

# Run migrations
npm run test:db:migrate
```

### Environment Variables

Create a `.env.test` file with test-specific environment variables:

```bash
# Test Database
DATABASE_URL=postgresql://localhost:5432/photobook_test

# Test API Keys
CLOUDINARY_CLOUD_NAME=test_cloud
CLOUDINARY_API_KEY=test_key
CLOUDINARY_API_SECRET=test_secret

# Test JWT Secret
JWT_SECRET=test_jwt_secret

# Test Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Mocking and Stubbing

### Mocking External Services

Use mocks to isolate tests from external dependencies:

```javascript
// Mock Cloudinary upload
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((options, callback) => {
        // Simulate successful upload
        callback(null, {
          secure_url: 'http://example.com/uploaded.jpg'
        });
        return { pipe: jest.fn() };
      })
    }
  }
}));
```

### Mocking API Calls

Mock API calls in frontend tests:

```javascript
// Mock API service
jest.mock('@/lib/api', () => ({
  photoApi: {
    getPhotos: jest.fn(),
    uploadPhoto: jest.fn(),
    deletePhoto: jest.fn()
  }
}));
```

## Test Data Management

### Fixtures

Use fixtures to create consistent test data:

```javascript
// test/fixtures/users.ts
export const testUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User'
};

export const testPhoto = {
  id: 'photo-1',
  userId: 'user-1',
  url: 'http://example.com/test.jpg',
  name: 'Test Photo'
};
```

### Factories

Use factories to generate test data:

```javascript
// test/factories/photoFactory.ts
import { Prisma } from '@prisma/client';

export const createPhoto = (overrides: Partial<Prisma.PhotoCreateInput> = {}) => {
  return {
    name: 'Test Photo',
    url: 'http://example.com/test.jpg',
    size: 1024,
    type: 'image/jpeg',
    ...overrides
  };
};
```

## Continuous Integration

### GitHub Actions

Example CI workflow for running tests:

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:12
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run database migrations
      run: npm run test:db:migrate
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres
    
    - name: Run tests
      run: npm test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres
```

## Performance Testing

### Load Testing

Use tools like Artillery or k6 for load testing:

```javascript
// test/performance/load-test.js
import { check } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '30s', target: 100 }, // Ramp up to 100 users
    { duration: '1m', target: 100 },  // Stay at 100 users
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
};

export default function () {
  const res = http.get('http://localhost:3000/api/products');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## Security Testing

### Vulnerability Scanning

Use tools like OWASP ZAP or Snyk for security testing:

```bash
# Scan for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Penetration Testing

Regular penetration testing should be performed by security professionals to identify potential vulnerabilities.

## Test Reporting

### Coverage Reports

Generate coverage reports to track test coverage:

```bash
# Generate coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/lcov-report/index.html
```

### Test Results

Configure test runners to output results in CI-friendly formats:

```javascript
// jest.config.js
module.exports = {
  // ... other config
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports',
      outputName: 'junit.xml'
    }]
  ]
};
```

## Best Practices

### Test Organization

1. **Structure tests logically**: Group related tests in describe blocks
2. **Use descriptive test names**: Test names should clearly describe what is being tested
3. **Keep tests independent**: Tests should not depend on the state from other tests
4. **Clean up after tests**: Use afterEach or afterAll to clean up test data

### Test Quality

1. **Test edge cases**: Include tests for boundary conditions and error cases
2. **Avoid testing implementation details**: Focus on testing behavior rather than implementation
3. **Use realistic test data**: Use data that represents real-world scenarios
4. **Mock external dependencies**: Isolate the code under test from external services

### Performance

1. **Run tests in parallel**: Configure test runners to run tests in parallel
2. **Use focused tests**: Run only the tests that are relevant to your changes
3. **Optimize test setup**: Minimize the time spent in beforeEach hooks
4. **Cache test data**: Reuse test data when possible to reduce setup time

## Troubleshooting

### Common Issues

1. **Tests failing due to async operations**: Use async/await or proper Promise handling
2. **Database state issues**: Use transactions or truncate tables between tests
3. **Mocking issues**: Ensure mocks are properly reset between tests
4. **Timeout errors**: Increase timeout values for slow tests

### Debugging Tips

1. **Use console.log for debugging**: Add temporary console.log statements to understand test flow
2. **Run tests in isolation**: Use .only or .skip to run specific tests
3. **Check test environment**: Verify environment variables and configuration
4. **Review test data**: Ensure test data is correctly set up

## Conclusion

This testing guide provides a comprehensive framework for ensuring the quality and reliability of the Photo Book Creator application. By following these practices and continuously improving the test suite, you can maintain a high level of confidence in the application's functionality and performance.