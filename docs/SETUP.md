# Setup Guide

## Overview

This document provides step-by-step instructions for setting up the Photo Book Creator application for local development. Follow these instructions to get the application running on your machine.

## Prerequisites

### System Requirements
- Node.js 18+ (LTS recommended)
- PostgreSQL 13+
- Git
- Code editor (VS Code recommended)
- Terminal/Command Prompt

### Optional Tools
- Docker (for containerized development)
- Postman (for API testing)
- pgAdmin (for database management)

## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd photo-book-app
```

### 2. Install Root Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

#### Frontend
```bash
# Copy the example environment file
cp apps/frontend/.env.example apps/frontend/.env
```

Update the `.env` file with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

#### Backend
```bash
# Copy the example environment file
cp apps/backend/.env.example apps/backend/.env
```

Update the `.env` file with your configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/photobook
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
PORT=4000
```

### 4. Database Setup

#### Install PostgreSQL
If you don't have PostgreSQL installed, download and install it from [postgresql.org](https://www.postgresql.org/download/).

#### Create Database
```bash
# Create the database
createdb photobook

# Or using psql
psql -U postgres -c "CREATE DATABASE photobook;"
```

#### Run Prisma Migrations
```bash
cd apps/backend
npx prisma migrate dev --name init
```

### 5. Install Service Dependencies

#### Cloudinary Setup
1. Sign up for a free account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Update the backend `.env` file with these values

#### Stripe Setup
1. Sign up for a Stripe account at [stripe.com](https://stripe.com)
2. Get your Publishable Key and Secret Key from the dashboard
3. Update the backend `.env` file with these values

## Running the Application

### Development Mode

#### Option 1: Using npm scripts
```bash
# Terminal 1: Start the backend
npm run dev:backend

# Terminal 2: Start the frontend
npm run dev:frontend
```

#### Option 2: Using Docker
```bash
# Build and start all services
docker-compose up --build
```

### Production Mode
```bash
# Build both applications
npm run build:frontend
npm run build:backend

# Start both applications
npm run start:frontend
npm run start:backend
```

## Application Access

### Frontend
- URL: http://localhost:3000
- Features:
  - User authentication
  - Photo upload and management
  - Photo book designer
  - Shopping cart
  - Order management

### Backend API
- URL: http://localhost:4000
- API Documentation: http://localhost:4000/api/docs (when implemented)
- Health Check: http://localhost:4000/health

### Database
- Host: localhost
- Port: 5432
- Database: photobook
- Username: postgres (default)
- Password: postgres (default, change in production)

## Development Workflow

### Code Structure
```
photo-book-app/
├── apps/
│   ├── frontend/           # Next.js frontend
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utility functions and hooks
│   │   └── public/         # Static assets
│   └── backend/            # Node.js backend
│       ├── src/
│       │   ├── controllers/ # Request handlers
│       │   ├── services/    # Business logic
│       │   ├── routes/      # API routes
│       │   └── middleware/  # Middleware functions
│       └── prisma/         # Database schema
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── config/             # Shared configuration
│   └── types/              # Shared TypeScript types
├── docs/                   # Documentation
└── docker-compose.yml      # Docker configuration
```

### Adding New Features

#### Frontend
1. Create new pages in `apps/frontend/app/`
2. Add new components in `apps/frontend/components/`
3. Update routes in `apps/frontend/app/`
4. Add new API services in `apps/frontend/lib/api.ts`

#### Backend
1. Add new routes in `apps/backend/src/routes/`
2. Create new controllers in `apps/backend/src/controllers/`
3. Implement business logic in `apps/backend/src/services/`
4. Update Prisma schema if needed in `prisma/schema.prisma`
5. Run migrations: `npx prisma migrate dev --name migration_name`

### Testing

#### Unit Tests
```bash
# Run all tests
npm run test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
```

#### End-to-End Tests
```bash
# Run E2E tests
npm run test:e2e
```

### Code Quality

#### Linting
```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix
```

#### Formatting
```bash
# Format all code
npm run format
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
- Ensure PostgreSQL is running
- Verify database credentials in `.env` file
- Check if the database exists
- Verify network connectivity

#### 2. Port Conflicts
- Change the PORT in `.env` files
- Kill processes using the ports:
  ```bash
  # Find process using port 3000
  lsof -i :3000
  
  # Kill process
  kill -9 <PID>
  ```

#### 3. Dependency Installation Issues
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Reinstall dependencies: `npm install`

#### 4. Environment Variable Issues
- Ensure all required environment variables are set
- Check for typos in variable names
- Restart the application after updating environment variables

### Debugging Tips

#### Frontend Debugging
- Use browser developer tools
- Check console for errors
- Use React DevTools extension
- Enable React strict mode in development

#### Backend Debugging
- Use console.log for debugging
- Check application logs
- Use debugging tools like ndb or VS Code debugger
- Monitor database queries with Prisma logging

#### Database Debugging
- Use pgAdmin or psql to inspect data
- Check Prisma Studio: `npx prisma studio`
- Enable query logging in Prisma

## Useful Commands

### Database Management
```bash
# Open Prisma Studio
npx prisma studio

# Generate Prisma client
npx prisma generate

# Reset database (development only)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name migration_name
```

### Docker Commands
```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# Execute command in container
docker-compose exec <service> <command>
```

### Git Workflow
```bash
# Create new branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

## Contributing

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write unit tests for new features
- Document public APIs
- Follow the existing code structure

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
6. Request review from team members

### Code Review Guidelines
- Review code for correctness and efficiency
- Check for security vulnerabilities
- Ensure proper error handling
- Verify test coverage
- Check documentation updates

## Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Express.js Documentation](https://expressjs.com/)

### Learning Resources
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Docker Documentation](https://docs.docker.com/)

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [Prisma Slack](https://slack.prisma.io/)
- [React Community](https://reactjs.org/community/support.html)

## Support

For issues not covered in this guide:
1. Check the GitHub issues
2. Search existing discussions
3. Create a new issue with detailed information
4. Include error messages and steps to reproduce

## Conclusion

This setup guide should help you get the Photo Book Creator application running locally. If you encounter any issues, please refer to the troubleshooting section or reach out to the development team for assistance.