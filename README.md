# Photo Book Creator

A modern, responsive web application for creating and ordering custom photo books.

## Technology Stack

- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with TypeScript
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Image Processing**: Fabric.js
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary
- **Payment Processing**: Stripe
- **Deployment**: Vercel (frontend) and Railway/Render (backend)

## Project Structure

```
photo-book-app/
├── apps/
│   ├── frontend/           # Next.js frontend
│   └── backend/            # Node.js backend
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── config/             # Shared configuration
│   └── types/              # Shared TypeScript types
├── prisma/                 # Database schema
├── docker-compose.yml      # Docker configuration
├── package.json            # Monorepo root
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Docker (optional, for containerization)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd photo-book-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Frontend
   cp apps/frontend/.env.example apps/frontend/.env
   
   # Backend
   cp apps/backend/.env.example apps/backend/.env
   ```

4. Update the environment variables in both `.env` files with your configuration.

### Database Setup

1. Make sure PostgreSQL is running
2. Update the `DATABASE_URL` in the backend `.env` file
3. Run Prisma migrations:
   ```bash
   cd apps/backend
   npx prisma migrate dev --name init
   ```

### Running the Application

#### Development Mode

```bash
# Start both frontend and backend in development mode
npm run dev:frontend
npm run dev:backend
```

#### Using Docker

```bash
# Build and start all services
docker-compose up --build
```

### Building for Production

```bash
# Build frontend
npm run build:frontend

# Build backend
npm run build:backend
```

## Features

1. **User Authentication & Profiles**
   - User registration and login (email/password, Google, Facebook)
   - User profile management
   - Order history tracking
   - Address book management

2. **Photo Upload & Management**
   - Drag and drop photo upload
   - Support for multiple image formats
   - Image preview and basic editing
   - Photo organization (albums, tags)

3. **Photo Book Designer**
   - Canvas-based editor with Fabric.js
   - Multiple book templates and themes
   - Customizable layouts
   - Text and sticker additions
   - Real-time preview of book pages
   - Undo/redo functionality

4. **Product Customization**
   - Different book types (softcover, hardcover, layflat)
   - Various sizes (A4, A5, square formats)
   - Page count selection with pricing calculation
   - Cover customization options
   - Paper type selection

5. **Pricing & Cart System**
   - Dynamic pricing based on selections
   - GST/tax calculation
   - Promo code support
   - Shopping cart with item management
   - Order summary with detailed breakdown

6. **Ordering & Payment**
   - Secure checkout process
   - Multiple payment options
   - Order confirmation and email notifications
   - Order status tracking

7. **Content Management**
   - Dynamic content sections (reviews, FAQs, about)
   - Admin dashboard for content management
   - Category and product management
   - Promotional banner management
   - [Customer Reviews and Ratings System](./docs/reviews.md)

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

### Backend (Railway/Render)

1. Create a new service on Railway/Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy!

## API Documentation

The backend API is documented with Swagger. To view the documentation:

1. Start the backend server
2. Navigate to `http://localhost:4000/api-docs`

## Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.