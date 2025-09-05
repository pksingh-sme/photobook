# Analytics Dashboard Documentation

## Overview

The Analytics Dashboard provides administrators with comprehensive insights into the application's performance, user activity, sales data, and order statistics. This dashboard helps administrators make data-driven decisions to improve the business.

## Features

1. **Key Metrics Overview** - Displays critical business metrics at a glance
2. **Sales Visualization** - Interactive charts showing sales trends over time
3. **User Activity Tracking** - Real-time user engagement metrics
4. **Top Products Ranking** - Best-selling products with revenue data
5. **Order Status Monitoring** - Distribution of orders across different statuses

## Frontend Implementation

### Components

#### AnalyticsDashboard Component
Located at: `apps/frontend/app/admin/analytics/page.tsx`

This is the main dashboard component that fetches and displays all analytics data.

**Key Features:**
- Data fetching from multiple API endpoints
- Responsive grid layout
- Interactive period selection for sales data
- Loading states and error handling

#### Analytics API Service
Located at: `apps/frontend/lib/analyticsApi.ts`

This service handles all API calls to the backend analytics endpoints.

**Available Methods:**
- `getStats()` - Fetches overall statistics
- `getSalesData(period)` - Fetches sales data for a specific period
- `getUserActivity()` - Fetches user activity data
- `getTopProducts(limit)` - Fetches top-selling products
- `getOrderStats()` - Fetches order statistics

### Data Visualization

The dashboard includes several visualization components:

1. **Stat Cards** - Display key metrics with trend indicators
2. **Sales Chart** - Bar chart showing sales over time with period selection
3. **Order Status Chart** - Progress bars showing order distribution
4. **User Activity Cards** - Grid of user engagement metrics
5. **Top Products List** - Ranked list of best-selling products

## Backend Implementation

### Analytics Controller
Located at: `apps/backend/src/controllers/analyticsController.ts`

This controller handles all analytics-related API requests.

**Available Endpoints:**
- `GET /api/analytics/stats` - Returns overall statistics
- `GET /api/analytics/sales?period=:period` - Returns sales data (period: day|week|month|year)
- `GET /api/analytics/user-activity` - Returns user activity data
- `GET /api/analytics/top-products?limit=:limit` - Returns top products
- `GET /api/analytics/orders` - Returns order statistics

### Analytics Routes
Located at: `apps/backend/src/routes/analyticsRoutes.ts`

This file defines the routes for all analytics endpoints and applies authentication middleware.

## API Endpoints

### Get Overall Statistics
```
GET /api/analytics/stats
```

**Response:**
```json
{
  "totalRevenue": 45231.89,
  "totalOrders": 1234,
  "totalUsers": 567,
  "avgOrderValue": 36.67,
  "revenueChange": 20.1,
  "ordersChange": 15.3,
  "usersChange": 8.7,
  "avgOrderValueChange": 5.2
}
```

### Get Sales Data
```
GET /api/analytics/sales?period=:period
```

**Parameters:**
- `period` (optional) - Time period: day, week, month, year (default: month)

**Response:**
```json
[
  {
    "date": "2023-01-01",
    "amount": 1250.75
  },
  {
    "date": "2023-01-02",
    "amount": 980.50
  }
]
```

### Get User Activity
```
GET /api/analytics/user-activity
```

**Response:**
```json
{
  "activeUsers": 45,
  "newUserSignups": 12,
  "returningUsers": 33
}
```

### Get Top Products
```
GET /api/analytics/top-products?limit=:limit
```

**Parameters:**
- `limit` (optional) - Number of products to return (default: 5)

**Response:**
```json
[
  {
    "id": "1",
    "name": "Hardcover Photo Book",
    "sales": 125,
    "revenue": 3750
  },
  {
    "id": "2",
    "name": "Softcover Photo Book",
    "sales": 98,
    "revenue": 2450
  }
]
```

### Get Order Statistics
```
GET /api/analytics/orders
```

**Response:**
```json
{
  "totalOrders": 342,
  "pendingOrders": 24,
  "processingOrders": 45,
  "shippedOrders": 156,
  "deliveredOrders": 117
}
```

## Authentication

All analytics endpoints require authentication. The frontend automatically includes the authentication token in all requests.

## Testing

### Frontend Tests
Located at: `apps/frontend/lib/analyticsApi.test.ts`

Tests cover all API service methods:
- Successful data fetching
- Error handling
- Parameter validation

### Backend Tests
Backend tests should cover:
- Controller method responses
- Data aggregation logic
- Error handling
- Authentication validation

## Future Enhancements

1. **Real-time Data** - Implement WebSocket connections for live updates
2. **Custom Reports** - Allow administrators to create custom reports
3. **Export Functionality** - Enable data export to CSV/PDF
4. **Advanced Filtering** - Add date range and category filtering
5. **Geographic Data** - Show sales and user data by location
6. **Conversion Tracking** - Track user journey from visit to purchase

## Performance Considerations

1. **Data Caching** - Cache frequently accessed analytics data
2. **Pagination** - Implement pagination for large datasets
3. **Lazy Loading** - Load charts and data only when visible
4. **Efficient Queries** - Optimize database queries for analytics data

## Security

1. **Role-based Access** - Only administrators can access analytics data
2. **Rate Limiting** - Prevent abuse of analytics endpoints
3. **Data Sanitization** - Sanitize all input parameters
4. **Audit Logging** - Log all analytics data access