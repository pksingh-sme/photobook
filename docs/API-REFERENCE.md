# API Reference

## Overview

The Photo Book Creator API provides endpoints for user authentication, photo management, design creation, product information, and order processing. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL

```
http://localhost:4000/api
```

For production environments, the base URL will be different based on your deployment configuration.

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API uses standard HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error responses follow this format:

```json
{
  "message": "Error description"
}
```

## Endpoints

### Authentication

#### Register a new user

```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

#### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

#### Get current user

```
GET /auth/me
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Photos

#### Upload a photo

```
POST /photos
```

**Form Data:**
- `photo`: The image file
- `name` (optional): Photo name
- `albumId` (optional): Album ID to associate with

**Response:**
```json
{
  "message": "Photo uploaded successfully",
  "photo": {
    "id": "photo-id",
    "userId": "user-id",
    "url": "https://example.com/photo.jpg",
    "name": "My Photo",
    "size": 123456,
    "type": "image/jpeg",
    "albumId": "album-id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get all photos

```
GET /photos
```

**Query Parameters:**
- `albumId` (optional): Filter by album ID

**Response:**
```json
[
  {
    "id": "photo-id",
    "userId": "user-id",
    "url": "https://example.com/photo.jpg",
    "name": "My Photo",
    "size": 123456,
    "type": "image/jpeg",
    "albumId": "album-id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get a specific photo

```
GET /photos/:id
```

**Response:**
```json
{
  "id": "photo-id",
  "userId": "user-id",
  "url": "https://example.com/photo.jpg",
  "name": "My Photo",
  "size": 123456,
  "type": "image/jpeg",
  "albumId": "album-id",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Delete a photo

```
DELETE /photos/:id
```

**Response:**
```json
{
  "message": "Photo deleted successfully"
}
```

### Albums

#### Create an album

```
POST /albums
```

**Request Body:**
```json
{
  "name": "Vacation Photos",
  "isPublic": false
}
```

**Response:**
```json
{
  "message": "Album created successfully",
  "album": {
    "id": "album-id",
    "userId": "user-id",
    "name": "Vacation Photos",
    "isPublic": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get all albums

```
GET /albums
```

**Response:**
```json
[
  {
    "id": "album-id",
    "userId": "user-id",
    "name": "Vacation Photos",
    "isPublic": false,
    "photos": [],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get a specific album

```
GET /albums/:id
```

**Response:**
```json
{
  "id": "album-id",
  "userId": "user-id",
  "name": "Vacation Photos",
  "isPublic": false,
  "photos": [
    {
      "id": "photo-id",
      "url": "https://example.com/photo.jpg",
      "name": "My Photo"
    }
  ],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Update an album

```
PUT /albums/:id
```

**Request Body:**
```json
{
  "name": "Updated Album Name",
  "isPublic": true
}
```

**Response:**
```json
{
  "message": "Album updated successfully",
  "album": {
    "id": "album-id",
    "userId": "user-id",
    "name": "Updated Album Name",
    "isPublic": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete an album

```
DELETE /albums/:id
```

**Response:**
```json
{
  "message": "Album deleted successfully"
}
```

### Designs

#### Create a design

```
POST /designs
```

**Request Body:**
```json
{
  "name": "My Photo Book Design",
  "description": "A custom photo book design",
  "data": {
    "pages": [
      {
        "id": "page-1",
        "elements": [],
        "width": 800,
        "height": 600
      }
    ],
    "settings": {
      "bookType": "softcover",
      "size": "A4",
      "pageCount": 20,
      "paperType": "glossy"
    }
  },
  "thumbnail": "https://example.com/thumbnail.jpg",
  "isPublic": false
}
```

**Response:**
```json
{
  "message": "Design created successfully",
  "design": {
    "id": "design-id",
    "userId": "user-id",
    "name": "My Photo Book Design",
    "description": "A custom photo book design",
    "data": { /* design data */ },
    "thumbnail": "https://example.com/thumbnail.jpg",
    "isPublic": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get all designs

```
GET /designs
```

**Response:**
```json
[
  {
    "id": "design-id",
    "userId": "user-id",
    "name": "My Photo Book Design",
    "description": "A custom photo book design",
    "thumbnail": "https://example.com/thumbnail.jpg",
    "isPublic": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get a specific design

```
GET /designs/:id
```

**Response:**
```json
{
  "id": "design-id",
  "userId": "user-id",
  "name": "My Photo Book Design",
  "description": "A custom photo book design",
  "data": { /* design data */ },
  "thumbnail": "https://example.com/thumbnail.jpg",
  "isPublic": false,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Update a design

```
PUT /designs/:id
```

**Request Body:**
```json
{
  "name": "Updated Design Name",
  "description": "An updated photo book design",
  "data": { /* updated design data */ },
  "thumbnail": "https://example.com/new-thumbnail.jpg",
  "isPublic": true
}
```

**Response:**
```json
{
  "message": "Design updated successfully",
  "design": {
    "id": "design-id",
    "userId": "user-id",
    "name": "Updated Design Name",
    "description": "An updated photo book design",
    "data": { /* updated design data */ },
    "thumbnail": "https://example.com/new-thumbnail.jpg",
    "isPublic": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete a design

```
DELETE /designs/:id
```

**Response:**
```json
{
  "message": "Design deleted successfully"
}
```

### Products

#### Get all products

```
GET /products
```

**Response:**
```json
[
  {
    "id": "product-id",
    "name": "Premium Hardcover Photo Book",
    "description": "A premium quality hardcover photo book",
    "price": 29.99,
    "categoryId": "category-id",
    "category": {
      "id": "category-id",
      "name": "Hardcover",
      "slug": "hardcover",
      "description": "Hardcover photo books"
    },
    "images": [
      {
        "id": "image-id",
        "url": "https://example.com/product.jpg",
        "alt": "Premium Hardcover Photo Book",
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "id": "variant-id",
        "name": "A4 Size, 40 Pages",
        "price": 29.99,
        "stock": 100,
        "attributes": {
          "size": "A4",
          "pages": 40
        }
      }
    ],
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get a specific product

```
GET /products/:id
```

**Response:**
```json
{
  "id": "product-id",
  "name": "Premium Hardcover Photo Book",
  "description": "A premium quality hardcover photo book",
  "price": 29.99,
  "categoryId": "category-id",
  "category": {
    "id": "category-id",
    "name": "Hardcover",
    "slug": "hardcover",
    "description": "Hardcover photo books"
  },
  "images": [
    {
      "id": "image-id",
      "url": "https://example.com/product.jpg",
      "alt": "Premium Hardcover Photo Book",
      "isPrimary": true
    }
  ],
  "variants": [
    {
      "id": "variant-id",
      "name": "A4 Size, 40 Pages",
      "price": 29.99,
      "stock": 100,
      "attributes": {
        "size": "A4",
        "pages": 40
      }
    }
  ],
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Get all categories

```
GET /products/categories
```

**Response:**
```json
[
  {
    "id": "category-id",
    "name": "Hardcover",
    "slug": "hardcover",
    "description": "Hardcover photo books",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Orders

#### Create an order

```
POST /orders
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product-id",
      "variantId": "variant-id",
      "quantity": 1
    }
  ],
  "shippingAddressId": "address-id",
  "billingAddressId": "address-id",
  "paymentMethodId": "payment-method-id"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "order-id",
    "userId": "user-id",
    "status": "PENDING",
    "totalAmount": 29.99,
    "taxAmount": 2.99,
    "discount": 0,
    "currency": "USD",
    "paymentId": null,
    "shippingAddressId": "address-id",
    "billingAddressId": "address-id",
    "trackingNumber": null,
    "items": [
      {
        "id": "order-item-id",
        "orderId": "order-id",
        "productId": "product-id",
        "product": {
          "id": "product-id",
          "name": "Premium Hardcover Photo Book",
          "price": 29.99
        },
        "quantity": 1,
        "price": 29.99,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get all orders

```
GET /orders
```

**Response:**
```json
[
  {
    "id": "order-id",
    "userId": "user-id",
    "status": "PENDING",
    "totalAmount": 29.99,
    "taxAmount": 2.99,
    "discount": 0,
    "currency": "USD",
    "paymentId": null,
    "shippingAddressId": "address-id",
    "billingAddressId": "address-id",
    "trackingNumber": null,
    "items": [
      {
        "id": "order-item-id",
        "orderId": "order-id",
        "productId": "product-id",
        "product": {
          "id": "product-id",
          "name": "Premium Hardcover Photo Book",
          "price": 29.99
        },
        "quantity": 1,
        "price": 29.99
      }
    ],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get a specific order

```
GET /orders/:id
```

**Response:**
```json
{
  "id": "order-id",
  "userId": "user-id",
  "status": "PENDING",
  "totalAmount": 29.99,
  "taxAmount": 2.99,
  "discount": 0,
  "currency": "USD",
  "paymentId": null,
  "shippingAddressId": "address-id",
  "billingAddressId": "address-id",
  "trackingNumber": null,
  "items": [
    {
      "id": "order-item-id",
      "orderId": "order-id",
      "productId": "product-id",
      "product": {
        "id": "product-id",
        "name": "Premium Hardcover Photo Book",
        "price": 29.99
      },
      "quantity": 1,
      "price": 29.99
    }
  ],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Addresses

#### Create an address

```
POST /addresses
```

**Request Body:**
```json
{
  "name": "Home",
  "street": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "zipCode": "12345",
  "country": "USA",
  "isDefault": true
}
```

**Response:**
```json
{
  "message": "Address created successfully",
  "address": {
    "id": "address-id",
    "userId": "user-id",
    "name": "Home",
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA",
    "isDefault": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get all addresses

```
GET /addresses
```

**Response:**
```json
[
  {
    "id": "address-id",
    "userId": "user-id",
    "name": "Home",
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA",
    "isDefault": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get a specific address

```
GET /addresses/:id
```

**Response:**
```json
{
  "id": "address-id",
  "userId": "user-id",
  "name": "Home",
  "street": "123 Main St",
  "city": "Anytown",
  "state": "CA",
  "zipCode": "12345",
  "country": "USA",
  "isDefault": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Update an address

```
PUT /addresses/:id
```

**Request Body:**
```json
{
  "name": "Work",
  "street": "456 Business Ave",
  "city": "Business City",
  "state": "NY",
  "zipCode": "67890",
  "country": "USA",
  "isDefault": false
}
```

**Response:**
```json
{
  "message": "Address updated successfully",
  "address": {
    "id": "address-id",
    "userId": "user-id",
    "name": "Work",
    "street": "456 Business Ave",
    "city": "Business City",
    "state": "NY",
    "zipCode": "67890",
    "country": "USA",
    "isDefault": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Delete an address

```
DELETE /addresses/:id
```

**Response:**
```json
{
  "message": "Address deleted successfully"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per hour per IP address
- 10 requests per minute per authenticated user

Exceeding these limits will result in a 429 (Too Many Requests) response.

## CORS

The API supports CORS for the following origins:
- `http://localhost:3000` (development)
- `https://yourdomain.com` (production - configured via environment variables)

## Versioning

The API is currently at version 1. Breaking changes will be introduced in new versions, with the version number included in the URL path.

## Changelog

### v1.0.0 (Initial Release)
- User authentication endpoints
- Photo management endpoints
- Album management endpoints
- Design creation and management endpoints
- Product and category endpoints
- Order processing endpoints
- Address management endpoints