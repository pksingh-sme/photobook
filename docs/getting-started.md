# Getting Started Guide

## Overview

This guide provides step-by-step instructions for setting up, running, and developing the Photo Book Creator application. Whether you're a new developer joining the team or someone looking to run the application locally, this guide will help you get started quickly.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (version 18 or higher)
2. **npm** (comes with Node.js) or **pnpm** (recommended)
3. **Git** for version control
4. **PostgreSQL** (version 12 or higher)
5. **Docker** (optional, for containerization)
6. **Code Editor** (VS Code recommended)

### Installing Node.js

#### Windows

1. Download the LTS version from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### macOS

Using Homebrew:
```bash
brew install node
```

Or download from [nodejs.org](https://nodejs.org/)

#### Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Installing PostgreSQL

#### Windows

1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the postgres user

#### macOS

Using Homebrew:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql.service
```

### Installing Git

#### Windows

Download from [git-scm.com](https://git-scm.com/downloads)

#### macOS

Using Homebrew:
```bash
brew install git
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt install git
```

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/photobook.git
cd photobook
```

### 2. Install Dependencies

The project uses a monorepo structure with npm workspaces. Install dependencies from the root directory:

```bash
npm install
```

This will install dependencies for all packages in the monorepo.

### 3. Environment Configuration

#### Frontend Environment Variables

Create a `.env` file in `apps/frontend/`:

```bash
cp apps/frontend/.env.example apps/frontend/.env
```

Update the values in `.env`:

```bash
# Next.js Environment
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Cloudinary (for image storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

#### Backend Environment Variables

Create a `.env` file in `apps/backend/`:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Update the values in `.env`:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/photobook

# Authentication
JWT_SECRET=your_jwt_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here

# Cloudinary (for image storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Email Service (for sending notifications)
EMAIL_SERVER=smtp://username:password@smtp.yourprovider.com:587
EMAIL_FROM=noreply@yourdomain.com

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Database Setup

#### Create Database

Connect to PostgreSQL and create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE photobook;

# Exit PostgreSQL
\q
```

#### Run Database Migrations

From the backend directory, run the Prisma migrations:

```bash
cd apps/backend
npx prisma migrate dev --name init
```

This will:
1. Create the database schema
2. Run the initial migration
3. Generate the Prisma client

### 5. Seed Database (Optional)

To populate the database with sample data:

```bash
npx prisma db seed
```

## Running the Application

### Development Mode

#### Start Backend Server

In one terminal, start the backend server:

```bash
cd apps/backend
npm run dev
```

The backend will be available at `http://localhost:4000`

#### Start Frontend Server

In another terminal, start the frontend server:

```bash
cd apps/frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Production Mode

#### Build Applications

```bash
# Build frontend
cd apps/frontend
npm run build

# Build backend
cd ../backend
npm run build
```

#### Start Applications

```bash
# Start frontend
cd apps/frontend
npm start

# Start backend
cd ../backend
npm start
```

### Using Docker (Optional)

If you prefer to run the application using Docker:

```bash
# Build and start all services
docker-compose up --build
```

This will start:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:4000`
- PostgreSQL database on port 5432

## Project Structure

The project follows a monorepo structure:

```
photo-book-app/
├── apps/
│   ├── frontend/           # Next.js frontend application
│   └── backend/            # Node.js backend API
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── config/             # Shared configuration
│   └── types/              # Shared TypeScript types
├── prisma/                 # Database schema and migrations
├── docs/                   # Documentation files
├── docker-compose.yml      # Docker configuration
├── package.json            # Root package.json with workspaces
└── README.md
```

### Frontend Structure

```
apps/frontend/
├── app/                    # App Router pages and layouts
│   ├── (auth)/            # Authentication routes
│   ├── design/            # Photo book designer
│   ├── gallery/           # Photo gallery
│   ├── products/          # Product pages
│   └── ...                # Other pages
├── components/            # Shared components
├── lib/                   # Utility functions and services
├── public/                # Static assets
└── styles/                # Global styles
```

### Backend Structure

```
apps/backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   └── lib/              # Utility functions
├── prisma/               # Prisma schema and client
└── tests/                # Test files
```

## Development Workflow

### Creating a New Feature

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow the existing code style and patterns
   - Write tests for new functionality
   - Update documentation if needed

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

5. **Push and create a pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style and Formatting

The project uses ESLint and Prettier for code formatting:

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test files
npm test -- path/to/test/file.test.ts
```

## Common Development Tasks

### Adding a New Page

1. Create a new directory in `apps/frontend/app/`
2. Add a `page.tsx` file with your page component
3. Add any necessary styling or components

Example:
```tsx
// apps/frontend/app/new-page/page.tsx
'use client';

import { Button } from '@ui/Button';

export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
      <Button>Click me</Button>
    </div>
  );
}
```

### Adding a New API Endpoint

1. Create a new controller in `apps/backend/src/controllers/`
2. Add routes in `apps/backend/src/routes/`
3. Implement business logic in `apps/backend/src/services/`

Example controller:
```typescript
// apps/backend/src/controllers/newController.ts
import { Request, Response } from 'express';

export const newController = {
  async getData(req: Request, res: Response) {
    try {
      // Your logic here
      res.json({ message: 'Data retrieved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
```

### Adding a New Database Model

1. Update the Prisma schema in `prisma/schema.prisma`
2. Run migrations:
   ```bash
   cd apps/backend
   npx prisma migrate dev --name add_new_model
   ```
3. Update TypeScript types in `packages/types/index.ts`
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

If you get an error that a port is already in use:

```bash
# Kill processes using the port (replace 3000 with the port number)
lsof -ti:3000 | xargs kill -9
```

#### 2. Database Connection Issues

Check your database connection string in the backend `.env` file and ensure:
- PostgreSQL is running
- The database exists
- Username and password are correct

#### 3. Missing Environment Variables

Ensure all required environment variables are set in both frontend and backend `.env` files.

#### 4. Dependency Installation Issues

If you encounter issues during `npm install`:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Debugging Tips

1. **Check logs**: Look at terminal output for error messages
2. **Use console.log**: Add temporary console.log statements for debugging
3. **Browser DevTools**: Use browser developer tools for frontend debugging
4. **Postman/Insomnia**: Test API endpoints directly

## Useful Commands

### Development

```bash
# Start both frontend and backend in development mode
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend
```

### Building

```bash
# Build both frontend and backend
npm run build

# Build only frontend
npm run build:frontend

# Build only backend
npm run build:backend
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend
```

### Database

```bash
# Run database migrations
cd apps/backend
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# View database schema
npx prisma studio
```

### Docker

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs
```

## Next Steps

After successfully setting up the project, you might want to:

1. **Explore the codebase**: Familiarize yourself with the project structure
2. **Run the existing tests**: Ensure everything is working correctly
3. **Create your first feature**: Try adding a simple feature to get familiar with the workflow
4. **Read the documentation**: Check out the other documentation files in the `docs/` directory
5. **Join the team**: Connect with other developers on the project

## Support

If you encounter any issues not covered in this guide:

1. **Check the documentation**: Look through the other docs in the `docs/` directory
2. **Search existing issues**: Check if someone else has encountered the same problem
3. **Ask for help**: Reach out to the development team or post in the project's communication channels
4. **Create an issue**: If you've found a bug or have a feature request, create an issue in the repository

This getting started guide should help you set up and run the Photo Book Creator application successfully. Happy coding!