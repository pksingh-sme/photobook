# Photo Book Creator API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Photos](#photos)
4. [Albums](#albums)
5. [Designs](#designs)
6. [Products](#products)
7. [Orders](#orders)
8. [Addresses](#addresses)

## Authentication

### Register a new user
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
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

### Get current user
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://example.com/image.jpg",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Photos

### Upload a photo
**POST** `/api/photos`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Form Data:**
```
photo: <file>
name: "My Photo"
albumId: "album-id" (optional)
```

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

### Get all photos
**GET** `/api/photos`

**Headers:**
```
Authorization: Bearer <jwt-token>
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

### Get a photo by ID
**GET** `/api/photos/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
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

### Delete a photo
**DELETE** `/api/photos/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Photo deleted successfully"
}
```

## Albums

### Create an album
**POST** `/api/albums`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "My Vacation Photos",
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
    "name": "My Vacation Photos",
    "isPublic": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Get all albums
**GET** `/api/albums`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "album-id",
    "userId": "user-id",
    "name": "My Vacation Photos",
    "isPublic": false,
    "photos": [],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get an album by ID
**GET** `/api/albums/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "album-id",
  "userId": "user-id",
  "name": "My Vacation Photos",
  "isPublic": false,
  "photos": [],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Update an album
**PUT** `/api/albums/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
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

### Delete an album
**DELETE** `/api/albums/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Album deleted successfully"
}
```

## Designs

### Create a design
**POST** `/api/designs`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "My Photo Book Design",
  "description": "A beautiful photo book design",
  "data": {},
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
    "description": "A beautiful photo book design",
    "data": {},
    "thumbnail": "https://example.com/thumbnail.jpg",
    "isPublic": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Get all designs
**GET** `/api/designs`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "design-id",
    "userId": "user-id",
    "name": "My Photo Book Design",
    "description": "A beautiful photo book design",
    "data": {},
    "thumbnail": "https://example.com/thumbnail.jpg",
    "isPublic": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get a design by ID
**GET** `/api/designs/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "design-id",
  "userId": "user-id",
  "name": "My Photo Book Design",
  "description": "A beautiful photo book design",
  "data": {},
  "thumbnail": "https://example.com/thumbnail.jpg",
  "isPublic": false,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Update a design
**PUT** `/api/designs/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Updated Design Name",
  "description": "An updated photo book design",
  "data": {},
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
    "data": {},
    "thumbnail": "https://example.com/new-thumbnail.jpg",
    "isPublic": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Delete a design
**DELETE** `/api/designs/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Design deleted successfully"
}
```

## Products

### Get all products
**GET** `/api/products`

**Response:**
```json
[
  {
    "id": "product-id",
    "name": "Classic Photo Book",
    "description": "Our most popular photo book",
    "price": 29.99,
    "categoryId": "category-id",
    "category": {
      "id": "category-id",
      "name": "Photo Books",
      "slug": "photo-books",
      "description": "All photo book products",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "images": [
      {
        "id": "image-id",
        "productId": "product-id",
        "url": "https://example.com/product.jpg",
        "alt": "Classic Photo Book",
        "isPrimary": true,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "variants": [
      {
        "id": "variant-id",
        "productId": "product-id",
        "name": "Softcover",
        "price": 29.99,
        "stock": 100,
        "attributes": {
          "cover": "softcover",
          "size": "A4"
        },
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get a product by ID
**GET** `/api/products/:id`

**Response:**
```json
{
  "id": "product-id",
  "name": "Classic Photo Book",
  "description": "Our most popular photo book",
  "price": 29.99,
  "categoryId": "category-id",
  "category": {
    "id": "category-id",
    "name": "Photo Books",
    "slug": "photo-books",
    "description": "All photo book products",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "images": [
    {
      "id": "image-id",
      "productId": "product-id",
      "url": "https://example.com/product.jpg",
      "alt": "Classic Photo Book",
      "isPrimary": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "variants": [
    {
      "id": "variant-id",
      "productId": "product-id",
      "name": "Softcover",
      "price": 29.99,
      "stock": 100,
      "attributes": {
        "cover": "softcover",
        "size": "A4"
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Get all categories
**GET** `/api/products/categories`

**Response:**
```json
[
  {
    "id": "category-id",
    "name": "Photo Books",
    "slug": "photo-books",
    "description": "All photo book products",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

## Orders

### Create an order
**POST** `/api/orders`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product-id",
      "quantity": 2
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
    "totalAmount": 59.98,
    "taxAmount": 0,
    "discount": 0,
    "currency": "USD",
    "paymentId": null,
    "shippingAddressId": "address-id",
    "billingAddressId": "address-id",
    "trackingNumber": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "clientSecret": "stripe-client-secret"
}
```

### Get all orders
**GET** `/api/orders`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "order-id",
    "userId": "user-id",
    "status": "PENDING",
    "totalAmount": 59.98,
    "taxAmount": 0,
    "discount": 0,
    "currency": "USD",
    "paymentId": null,
    "shippingAddressId": "address-id",
    "billingAddressId": "address-id",
    "trackingNumber": null,
    "items": [
      {
        "id": "item-id",
        "orderId": "order-id",
        "productId": "product-id",
        "product": {
          "id": "product-id",
          "name": "Classic Photo Book",
          "description": "Our most popular photo book",
          "price": 29.99,
          "categoryId": "category-id",
          "category": {
            "id": "category-id",
            "name": "Photo Books",
            "slug": "photo-books",
            "description": "All photo book products",
            "createdAt": "2023-01-01T00:00:00.000Z",
            "updatedAt": "2023-01-01T00:00:00.000Z"
          },
          "images": [
            {
              "id": "image-id",
              "productId": "product-id",
              "url": "https://example.com/product.jpg",
              "alt": "Classic Photo Book",
              "isPrimary": true,
              "createdAt": "2023-01-01T00:00:00.000Z",
              "updatedAt": "2023-01-01T00:00:00.000Z"
            }
          ],
          "variants": [
            {
              "id": "variant-id",
              "productId": "product-id",
              "name": "Softcover",
              "price": 29.99,
              "stock": 100,
              "attributes": {
                "cover": "softcover",
                "size": "A4"
              },
              "createdAt": "2023-01-01T00:00:00.000Z",
              "updatedAt": "2023-01-01T00:00:00.000Z"
            }
          ],
          "isActive": true,
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        "quantity": 2,
        "price": 29.99,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "shippingAddress": {
      "id": "address-id",
      "userId": "user-id",
      "name": "Home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "isDefault": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "billingAddress": {
      "id": "address-id",
      "userId": "user-id",
      "name": "Home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "isDefault": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get an order by ID
**GET** `/api/orders/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "order-id",
  "userId": "user-id",
  "status": "PENDING",
  "totalAmount": 59.98,
  "taxAmount": 0,
  "discount": 0,
  "currency": "USD",
  "paymentId": null,
  "shippingAddressId": "address-id",
  "billingAddressId": "address-id",
  "trackingNumber": null,
  "items": [
    {
      "id": "item-id",
      "orderId": "order-id",
      "productId": "product-id",
      "product": {
        "id": "product-id",
        "name": "Classic Photo Book",
        "description": "Our most popular photo book",
        "price": 29.99,
        "categoryId": "category-id",
        "category": {
          "id": "category-id",
          "name": "Photo Books",
          "slug": "photo-books",
          "description": "All photo book products",
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        },
        "images": [
          {
            "id": "image-id",
            "productId": "product-id",
            "url": "https://example.com/product.jpg",
            "alt": "Classic Photo Book",
            "isPrimary": true,
            "createdAt": "2023-01-01T00:00:00.000Z",
            "updatedAt": "2023-01-01T00:00:00.000Z"
          }
        ],
        "variants": [
          {
            "id": "variant-id",
            "productId": "product-id",
            "name": "Softcover",
            "price": 29.99,
            "stock": 100,
            "attributes": {
              "cover": "softcover",
              "size": "A4"
            },
            "createdAt": "2023-01-01T00:00:00.000Z",
            "updatedAt": "2023-01-01T00:00:00.000Z"
          }
        ],
        "isActive": true,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      },
      "quantity": 2,
      "price": 29.99,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "shippingAddress": {
    "id": "address-id",
    "userId": "user-id",
    "name": "Home",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "isDefault": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "billingAddress": {
    "id": "address-id",
    "userId": "user-id",
    "name": "Home",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "isDefault": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Update order status
**PUT** `/api/orders/:id/status`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Response:**
```json
{
  "message": "Order status updated successfully",
  "order": {
    "id": "order-id",
    "userId": "user-id",
    "status": "CONFIRMED",
    "totalAmount": 59.98,
    "taxAmount": 0,
    "discount": 0,
    "currency": "USD",
    "paymentId": null,
    "shippingAddressId": "address-id",
    "billingAddressId": "address-id",
    "trackingNumber": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Addresses

### Create an address
**POST** `/api/addresses`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
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
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "isDefault": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Get all addresses
**GET** `/api/addresses`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "address-id",
    "userId": "user-id",
    "name": "Home",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "isDefault": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get an address by ID
**GET** `/api/addresses/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": "address-id",
  "userId": "user-id",
  "name": "Home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "isDefault": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Update an address
**PUT** `/api/addresses/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Office",
  "street": "456 Park Ave",
  "city": "New York",
  "state": "NY",
  "zipCode": "10022",
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
    "name": "Office",
    "street": "456 Park Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10022",
    "country": "USA",
    "isDefault": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Delete an address
**DELETE** `/api/addresses/:id`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Address deleted successfully"
}
```