# CI/CD Pipeline Documentation

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Photo Book Creator application. The pipeline automates testing, building, and deployment of both frontend and backend services.

## Pipeline Structure

The CI/CD pipeline is implemented using GitHub Actions and consists of two main jobs:

1. **Frontend CI/CD** - Handles testing, building, and deployment of the Next.js frontend
2. **Backend CI/CD** - Handles testing, building, and deployment of the Node.js backend

## Workflow Triggers

The pipeline is triggered on:
- Push events to `main` and `develop` branches
- Pull request events to `main` and `develop` branches

## Frontend CI/CD Job

### Steps:
1. **Checkout code** - Retrieves the latest code from the repository
2. **Setup Node.js** - Installs Node.js 18 and caches npm dependencies
3. **Install dependencies** - Installs all npm dependencies using `npm ci`
4. **Run frontend tests** - Executes frontend test suite
5. **Build frontend** - Builds the Next.js application for production
6. **Deploy to Vercel** - Deploys the frontend to Vercel (only on `main` branch)

### Environment Variables:
- `NEXT_PUBLIC_API_URL` - URL of the backend API service

## Backend CI/CD Job

### Steps:
1. **Checkout code** - Retrieves the latest code from the repository
2. **Setup Node.js** - Installs Node.js 18 and caches npm dependencies
3. **Install dependencies** - Installs all npm dependencies using `npm ci`
4. **Run database migrations** - Applies database schema changes
5. **Run backend tests** - Executes backend test suite with PostgreSQL service
6. **Build backend** - Compiles TypeScript code to JavaScript
7. **Deploy to Railway** - Deploys the backend to Railway (only on `main` branch)

### Services:
- **PostgreSQL** - Test database for running backend tests

### Environment Variables:
- `DATABASE_URL` - Connection string for the PostgreSQL database
- `JWT_SECRET` - Secret key for JWT token generation
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for image storage
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `RAILWAY_TOKEN` - Authentication token for Railway deployment

## Secrets Configuration

The following secrets need to be configured in GitHub repository settings:

| Secret Name | Description | Used By |
|-------------|-------------|---------|
| `VERCEL_TOKEN` | Vercel authentication token | Frontend deployment |
| `VERCEL_ORG_ID` | Vercel organization ID | Frontend deployment |
| `VERCEL_PROJECT_ID` | Vercel project ID | Frontend deployment |
| `RAILWAY_TOKEN` | Railway authentication token | Backend deployment |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Backend tests |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Backend tests |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Backend tests |

## Deployment Targets

### Frontend
- **Platform**: Vercel
- **Branch**: `main`
- **URL**: Configured in Vercel project settings

### Backend
- **Platform**: Railway
- **Branch**: `main`
- **URL**: Configured in Railway project settings

## Local Development

To test the CI/CD pipeline locally, you can use [Act](https://github.com/nektos/act):

```bash
# Install Act
brew install act

# Run the pipeline locally
act push -s VERCEL_TOKEN=your_vercel_token -s RAILWAY_TOKEN=your_railway_token
```

## Monitoring and Notifications

The pipeline includes built-in GitHub Actions notifications for:
- Successful deployments
- Failed deployments
- Test failures

Additional monitoring can be configured through:
- Vercel deployment logs
- Railway deployment logs
- GitHub Actions workflow logs

## Rollback Procedures

### Frontend Rollback
1. Navigate to Vercel dashboard
2. Select the project
3. Go to "Deployments" tab
4. Redeploy a previous successful deployment

### Backend Rollback
1. Navigate to Railway dashboard
2. Select the project
3. Go to "Deployments" tab
4. Rollback to a previous successful deployment

## Troubleshooting

### Common Issues

1. **Dependency Installation Failures**
   - Ensure `package-lock.json` is committed
   - Run `npm ci` locally to verify clean installation

2. **Test Failures**
   - Check database connection settings
   - Verify environment variables are correctly set
   - Ensure test database is accessible

3. **Build Failures**
   - Check for TypeScript compilation errors
   - Verify environment variables required for build

4. **Deployment Failures**
   - Verify secrets are correctly configured
   - Check platform-specific requirements (Vercel/Railway)

### Debugging Tips

1. Enable verbose logging in GitHub Actions
2. Use `act` for local pipeline testing
3. Check platform-specific logs (Vercel/Railway)
4. Verify environment variables and secrets