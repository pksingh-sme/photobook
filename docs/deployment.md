# Deployment Guide

## Overview

This guide provides detailed instructions for deploying the Photo Book Creator application to production environments. The application consists of a frontend (Next.js) and backend (Node.js/Express) that can be deployed independently or together.

## Prerequisites

Before deploying, ensure you have:

1. A domain name (optional but recommended)
2. SSL certificate (required for production)
3. Database (PostgreSQL)
4. Cloud storage account (Cloudinary)
5. Payment processing account (Stripe)
6. Email service provider (for sending notifications)

## Environment Variables

Both frontend and backend require specific environment variables to be set. Create `.env.production` files in each respective directory.

### Frontend Environment Variables

```bash
# Next.js Environment
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret

# Deployment
NODE_ENV=production
```

### Backend Environment Variables

```bash
# Server Configuration
PORT=4000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Processing
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Service
EMAIL_SERVER=smtp://username:password@smtp.yourprovider.com:587
EMAIL_FROM=noreply@yourdomain.com

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Deployment Options

### Option 1: Vercel + Railway/Render (Recommended)

This is the recommended deployment approach as it separates frontend and backend concerns.

#### Frontend Deployment (Vercel)

1. **Connect to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Connect your GitHub repository
   - Select the `apps/frontend` directory

2. **Configure Environment Variables:**
   - In the Vercel dashboard, go to your project settings
   - Add all frontend environment variables under "Environment Variables"

3. **Deploy:**
   - Vercel will automatically deploy on pushes to the main branch
   - Manual deployments can be triggered from the dashboard

#### Backend Deployment (Railway)

1. **Create Railway Account:**
   - Sign up at [Railway](https://railway.app)

2. **Deploy Backend:**
   - Create a new project
   - Connect your GitHub repository
   - Select the `apps/backend` directory
   - Configure environment variables in the Railway dashboard

3. **Database Setup:**
   - Railway provides a PostgreSQL database addon
   - Update your `DATABASE_URL` environment variable accordingly

4. **Domain Configuration:**
   - Add a custom domain in Railway settings
   - Configure DNS records with your domain provider

#### Backend Deployment (Render)

1. **Create Render Account:**
   - Sign up at [Render](https://render.com)

2. **Deploy Backend:**
   - Create a new Web Service
   - Connect your GitHub repository
   - Set the root directory to `apps/backend`
   - Set the build command to `npm run build`
   - Set the start command to `npm start`

3. **Environment Variables:**
   - Add all backend environment variables in the Render dashboard

4. **Database Setup:**
   - Create a PostgreSQL database on Render
   - Update your `DATABASE_URL` environment variable

5. **Domain Configuration:**
   - Add a custom domain in Render settings
   - Configure DNS records with your domain provider

### Option 2: Docker Deployment

The application includes Docker configuration for containerized deployment.

#### Building Docker Images

1. **Build Frontend Image:**
   ```bash
   cd apps/frontend
   docker build -t photobook-frontend .
   ```

2. **Build Backend Image:**
   ```bash
   cd apps/backend
   docker build -t photobook-backend .
   ```

#### Running with Docker Compose

1. **Update docker-compose.yml:**
   - Modify environment variables as needed
   - Update port mappings if necessary

2. **Deploy:**
   ```bash
   docker-compose up -d
   ```

#### Deploying to Container Orchestration Platforms

##### Kubernetes

1. **Create Kubernetes Manifests:**
   - Create deployments for frontend and backend
   - Create services for internal and external access
   - Create ingress for external routing

2. **Deploy to Cluster:**
   ```bash
   kubectl apply -f kubernetes/
   ```

##### Docker Swarm

1. **Initialize Swarm (if needed):**
   ```bash
   docker swarm init
   ```

2. **Deploy Stack:**
   ```bash
   docker stack deploy -c docker-compose.yml photobook
   ```

### Option 3: Traditional Server Deployment

#### Server Requirements

- Node.js 18+
- PostgreSQL 12+
- Nginx or Apache (for reverse proxy)
- SSL certificate (Let's Encrypt recommended)

#### Deployment Steps

1. **Clone Repository:**
   ```bash
   git clone https://github.com/yourusername/photobook.git
   cd photobook
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Build Applications:**
   ```bash
   # Build frontend
   cd apps/frontend
   npm run build
   
   # Build backend
   cd ../backend
   npm run build
   ```

4. **Configure Environment Variables:**
   - Create `.env.production` files in both apps
   - Set appropriate values for your environment

5. **Database Setup:**
   ```bash
   cd apps/backend
   npx prisma migrate deploy
   ```

6. **Start Applications:**
   ```bash
   # Start backend
   npm start
   
   # Start frontend (in a separate process or using a process manager like PM2)
   cd ../frontend
   npm start
   ```

7. **Configure Reverse Proxy (Nginx Example):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       # Redirect all HTTP requests to HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl;
       server_name yourdomain.com;
       
       ssl_certificate /path/to/your/certificate.crt;
       ssl_certificate_key /path://path/to/your/private.key;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /api {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Monitoring and Logging

### Application Monitoring

1. **Error Tracking:**
   - Integrate Sentry for error tracking
   - Set up alerts for critical errors

2. **Performance Monitoring:**
   - Use tools like New Relic or DataDog
   - Monitor API response times and database queries

3. **Uptime Monitoring:**
   - Set up uptime monitoring with tools like UptimeRobot
   - Configure alerts for downtime

### Logging

1. **Structured Logging:**
   - Implement structured logging in both frontend and backend
   - Use tools like Winston for Node.js logging

2. **Log Aggregation:**
   - Centralize logs using ELK stack or similar solutions
   - Set up log retention policies

3. **Audit Logging:**
   - Log important user actions for security and compliance
   - Store audit logs separately from application logs

## Security Considerations

### API Security

1. **Rate Limiting:**
   - Implement rate limiting to prevent abuse
   - Configure different limits for authenticated vs unauthenticated requests

2. **Input Validation:**
   - Validate all API inputs
   - Use libraries like Zod for schema validation

3. **Authentication:**
   - Use JWT tokens with appropriate expiration
   - Implement refresh token rotation

### Data Security

1. **Encryption:**
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications

2. **Database Security:**
   - Use parameterized queries to prevent SQL injection
   - Regularly update database software

3. **File Storage Security:**
   - Validate file types and sizes
   - Store files in private buckets with signed URLs for access

### Network Security

1. **Firewall Configuration:**
   - Restrict access to database ports
   - Only expose necessary ports to the internet

2. **CORS Configuration:**
   - Restrict CORS origins to trusted domains
   - Regularly review and update allowed origins

## Backup and Recovery

### Database Backups

1. **Automated Backups:**
   - Set up automated daily backups
   - Store backups in multiple geographic locations

2. **Backup Testing:**
   - Regularly test backup restoration
   - Document backup and recovery procedures

### File Backups

1. **Cloud Storage:**
   - Use versioned cloud storage for file backups
   - Enable cross-region replication

2. **Local Backups:**
   - Maintain local backups for critical files
   - Encrypt backup files

### Disaster Recovery

1. **Recovery Plan:**
   - Document step-by-step recovery procedures
   - Regularly test disaster recovery scenarios

2. **Failover:**
   - Set up failover mechanisms for critical services
   - Monitor failover systems regularly

## Scaling

### Horizontal Scaling

1. **Load Balancing:**
   - Use load balancers to distribute traffic
   - Configure health checks for backend instances

2. **Database Scaling:**
   - Use read replicas for database scaling
   - Implement connection pooling

### Vertical Scaling

1. **Resource Allocation:**
   - Monitor resource usage and scale accordingly
   - Set up auto-scaling policies where possible

### Caching

1. **Application Caching:**
   - Implement Redis for session storage and caching
   - Cache frequently accessed data

2. **CDN:**
   - Use CDN for static assets
   - Configure cache invalidation strategies

## Maintenance

### Regular Updates

1. **Dependency Updates:**
   - Regularly update npm packages
   - Monitor for security vulnerabilities

2. **System Updates:**
   - Keep operating system and software up to date
   - Apply security patches promptly

### Performance Tuning

1. **Database Optimization:**
   - Monitor slow queries and optimize indexes
   - Regularly analyze and vacuum PostgreSQL databases

2. **Application Optimization:**
   - Monitor and optimize API response times
   - Implement lazy loading and code splitting

## Troubleshooting

### Common Issues

1. **Deployment Failures:**
   - Check build logs for errors
   - Verify environment variables are correctly set

2. **Database Connection Issues:**
   - Verify database credentials and connectivity
   - Check firewall and network settings

3. **Performance Issues:**
   - Monitor resource usage
   - Check for memory leaks or inefficient queries

### Support

For additional help with deployment, contact our support team or consult the community forums.