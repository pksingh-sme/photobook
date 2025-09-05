# Customer Reviews and Ratings System

## Overview

The customer reviews and ratings system allows users to submit reviews for products they've purchased, view reviews from other customers, and interact with reviews by marking them as helpful.

## Features

1. **Product Reviews**: Users can submit reviews for products they've purchased
2. **Rating System**: 5-star rating system for products
3. **Verified Purchase Badge**: Reviews from users who actually purchased the product are marked as verified
4. **Review Editing**: Users can edit their own reviews
5. **Review Deletion**: Users can delete their own reviews
6. **Helpful Reviews**: Users can mark reviews as helpful
7. **Review Sorting**: Reviews are displayed with newest first

## Implementation Details

### Frontend Components

#### Review Component
- Displays individual reviews with user information
- Shows star ratings and review content
- Displays verified purchase badge for legitimate reviews
- Shows helpful count and allows users to mark reviews as helpful
- Provides edit and delete functionality for own reviews

#### ReviewForm Component
- Allows users to submit new reviews or edit existing ones
- Includes star rating selection
- Includes title and comment fields
- Provides validation for required fields

### Backend Services

#### Review Service
The review service handles all business logic for reviews:

1. **getReviews(productId)**: Fetches all reviews for a product
2. **createReview(userId, productId, rating, title, comment)**: Creates a new review
3. **updateReview(id, userId, rating, title, comment)**: Updates an existing review
4. **deleteReview(id, userId)**: Deletes a review
5. **markHelpful(reviewId, userId)**: Marks a review as helpful

### Database Schema

The reviews system uses two main tables:

1. **Review**: Stores review information
   - id: Unique identifier
   - userId: Reference to the user who submitted the review
   - productId: Reference to the product being reviewed
   - rating: Star rating (1-5)
   - title: Review title
   - comment: Review content
   - isVerifiedPurchase: Boolean indicating if user purchased the product
   - helpfulCount: Number of times review was marked as helpful

2. **HelpfulReview**: Tracks which users marked which reviews as helpful
   - userId: Reference to the user
   - reviewId: Reference to the review

### API Endpoints

#### GET /api/reviews
Fetches reviews for a product
- Query parameter: productId (required)

#### POST /api/reviews
Creates a new review
- Body: productId, rating, title, comment
- Authentication required

#### PUT /api/reviews/:id
Updates an existing review
- Body: rating, title, comment
- Authentication required
- Only review owner can update

#### DELETE /api/reviews/:id
Deletes a review
- Authentication required
- Only review owner can delete

#### POST /api/reviews/:id/helpful
Marks a review as helpful
- Authentication required

## Validation Rules

1. Users can only submit one review per product
2. Users can only review products they've purchased
3. Rating must be between 1 and 5
4. Title is required and must be at least 3 characters
5. Users can only edit/delete their own reviews
6. Users can only mark a review as helpful once

## Error Handling

The system handles various error conditions:
- Duplicate reviews
- Unauthorized access attempts
- Invalid rating values
- Missing required fields
- Non-existent reviews

## Testing

Frontend tests are implemented for:
- Review API service
- Review component rendering
- Review form validation

Backend tests are implemented for:
- Review service functions
- Validation logic
- Error handling

## Future Enhancements

1. Review moderation system
2. Photo uploads with reviews
3. Review reporting functionality
4. Advanced review filtering and sorting
5. Review response system for merchants