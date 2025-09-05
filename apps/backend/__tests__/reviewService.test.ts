import { reviewService } from '../src/services/reviewService';
import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mock PrismaClient
const mockPrisma = {
  review: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  orderItem: {
    findFirst: jest.fn(),
  },
  order: {
    findMany: jest.fn(),
  },
  helpfulReview: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

// Mock the entire PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe('reviewService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getReviews', () => {
    it('should fetch reviews for a product', async () => {
      const mockReviews = [
        {
          id: '1',
          userId: 'user1',
          productId: 'product1',
          rating: 5,
          title: 'Great product',
          comment: 'I love this product',
          isVerifiedPurchase: true,
          helpfulCount: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 'user1',
            name: 'John Doe',
          },
        },
      ];

      mockPrisma.review.findMany.mockResolvedValue(mockReviews);

      const reviews = await reviewService.getReviews('product1');
      
      expect(mockPrisma.review.findMany).toHaveBeenCalledWith({
        where: {
          productId: 'product1',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
          },
        },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(reviews).toEqual(mockReviews);
    });
  });

  describe('createReview', () => {
    it('should create a new review', async () => {
      const mockReview = {
        id: '1',
        userId: 'user1',
        productId: 'product1',
        rating: 5,
        title: 'Great product',
        comment: 'I love this product',
        isVerifiedPurchase: true,
        helpfulCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user1',
          name: 'John Doe',
        },
      };

      mockPrisma.review.findFirst.mockResolvedValue(null);
      mockPrisma.order.findMany.mockResolvedValue([{ id: 'order1' }]);
      mockPrisma.orderItem.findFirst.mockResolvedValue({ id: 'orderItem1' });
      mockPrisma.review.create.mockResolvedValue(mockReview);

      const review = await reviewService.createReview('user1', 'product1', 5, 'Great product', 'I love this product');
      
      expect(review).toEqual(mockReview);
      expect(mockPrisma.review.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user1',
          productId: 'product1',
        },
      });
      expect(mockPrisma.review.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          productId: 'product1',
          rating: 5,
          title: 'Great product',
          comment: 'I love this product',
          isVerifiedPurchase: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    it('should throw an error if user has already reviewed the product', async () => {
      mockPrisma.review.findFirst.mockResolvedValue({
        id: '1',
        userId: 'user1',
        productId: 'product1',
        rating: 5,
        title: 'Great product',
        comment: 'I love this product',
        isVerifiedPurchase: true,
        helpfulCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(reviewService.createReview('user1', 'product1', 5, 'Great product', 'I love this product'))
        .rejects.toThrow('You have already reviewed this product');
    });
  });

  describe('updateReview', () => {
    it('should update an existing review', async () => {
      const mockReview = {
        id: '1',
        userId: 'user1',
        productId: 'product1',
        rating: 5,
        title: 'Great product',
        comment: 'I love this product',
        isVerifiedPurchase: true,
        helpfulCount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedReview = {
        ...mockReview,
        rating: 4,
        title: 'Good product',
        comment: 'I like this product',
      };

      mockPrisma.review.findUnique.mockResolvedValue(mockReview);
      mockPrisma.review.update.mockResolvedValue(updatedReview);

      const review = await reviewService.updateReview('1', 'user1', 4, 'Good product', 'I like this product');
      
      expect(review).toEqual(updatedReview);
      expect(mockPrisma.review.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockPrisma.review.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          rating: 4,
          title: 'Good product',
          comment: 'I like this product',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    it('should throw an error if review is not found', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(null);

      await expect(reviewService.updateReview('1', 'user1', 4, 'Good product', 'I like this product'))
        .rejects.toThrow('Review not found');
    });

    it('should throw an error if user is not authorized to update the review', async () => {
      mockPrisma.review.findUnique.mockResolvedValue({
        id: '1',
        userId: 'user2', // Different user
        productId: 'product1',
        rating: 5,
        title: 'Great product',
        comment: 'I love this product',
        isVerifiedPurchase: true,
        helpfulCount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(reviewService.updateReview('1', 'user1', 4, 'Good product', 'I like this product'))
        .rejects.toThrow('Not authorized to update this review');
    });
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      const mockReview = {
        id: '1',
        userId: 'user1',
        productId: 'product1',
        rating: 5,
        title: 'Great product',
        comment: 'I love this product',
        isVerifiedPurchase: true,
        helpfulCount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.review.findUnique.mockResolvedValue(mockReview);
      mockPrisma.review.delete.mockResolvedValue();

      const result = await reviewService.deleteReview('1', 'user1');
      
      expect(result).toEqual({ message: 'Review deleted successfully' });
      expect(mockPrisma.review.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockPrisma.review.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw an error if review is not found', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(null);

      await expect(reviewService.deleteReview('1', 'user1'))
        .rejects.toThrow('Review not found');
    });

    it('should throw an error if user is not authorized to delete the review', async () => {
      mockPrisma.review.findUnique.mockResolvedValue({
        id: '1',
        userId: 'user2', // Different user
        productId: 'product1',
        rating: 5,
        title: 'Great product',
        comment: 'I love this product',
        isVerifiedPurchase: true,
        helpfulCount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(reviewService.deleteReview('1', 'user1'))
        .rejects.toThrow('Not authorized to delete this review');
    });
  });

  describe('markHelpful', () => {
    it('should mark a review as helpful', async () => {
      const mockReview = {
        id: '1',
        userId: 'user1',
        productId: 'product1',
        rating: 5,
        title: 'Great product',
        comment: 'I love this product',
        isVerifiedPurchase: true,
        helpfulCount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedReview = {
        ...mockReview,
        helpfulCount: 11,
      };

      mockPrisma.helpfulReview.findFirst.mockResolvedValue(null);
      mockPrisma.helpfulReview.create.mockResolvedValue();
      mockPrisma.review.update.mockResolvedValue(updatedReview);

      const review = await reviewService.markHelpful('1', 'user2');
      
      expect(review).toEqual(updatedReview);
      expect(mockPrisma.helpfulReview.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user2',
          reviewId: '1',
        },
      });
      expect(mockPrisma.helpfulReview.create).toHaveBeenCalledWith({
        data: {
          userId: 'user2',
          reviewId: '1',
        },
      });
      expect(mockPrisma.review.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      });
    });

    it('should throw an error if user has already marked the review as helpful', async () => {
      mockPrisma.helpfulReview.findFirst.mockResolvedValue({
        id: '1',
        userId: 'user2',
        reviewId: '1',
        createdAt: new Date(),
      });

      await expect(reviewService.markHelpful('1', 'user2'))
        .rejects.toThrow('You have already marked this review as helpful');
    });
  });
});