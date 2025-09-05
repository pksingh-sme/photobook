import { reviewApi } from './api';

// Mock fetch
global.fetch = jest.fn();

describe('reviewApi', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getReviews', () => {
    it('should fetch reviews for a product', async () => {
      const mockReviews = [
        {
          id: '1',
          userId: 'user1',
          user: { id: 'user1', name: 'John Doe' },
          rating: 5,
          title: 'Great product',
          comment: 'I love this product',
          isVerifiedPurchase: true,
          helpfulCount: 10,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReviews,
      });

      const reviews = await reviewApi.getReviews('product1');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/reviews?productId=product1');
      expect(reviews).toEqual(mockReviews);
    });

    it('should throw an error if fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(reviewApi.getReviews('product1')).rejects.toThrow('Failed to get reviews');
    });
  });

  describe('createReview', () => {
    it('should create a new review', async () => {
      const mockReview = {
        id: '1',
        userId: 'user1',
        user: { id: 'user1', name: 'John Doe' },
        rating: 5,
        title: 'Great product',
        comment: 'I love this product',
        isVerifiedPurchase: true,
        helpfulCount: 0,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReview,
      });

      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => 'token123');

      const review = await reviewApi.createReview('product1', 5, 'Great product', 'I love this product');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123',
        },
        body: JSON.stringify({
          productId: 'product1',
          rating: 5,
          title: 'Great product',
          comment: 'I love this product',
        }),
      });
      expect(review).toEqual(mockReview);
    });

    it('should throw an error if fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => 'token123');

      await expect(reviewApi.createReview('product1', 5, 'Great product', 'I love this product'))
        .rejects.toThrow('Failed to create review');
    });
  });

  describe('updateReview', () => {
    it('should update an existing review', async () => {
      const mockReview = {
        id: '1',
        userId: 'user1',
        user: { id: 'user1', name: 'John Doe' },
        rating: 4,
        title: 'Good product',
        comment: 'I like this product',
        isVerifiedPurchase: true,
        helpfulCount: 5,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-02T00:00:00Z',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReview,
      });

      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => 'token123');

      const review = await reviewApi.updateReview('1', 4, 'Good product', 'I like this product');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/reviews/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123',
        },
        body: JSON.stringify({
          rating: 4,
          title: 'Good product',
          comment: 'I like this product',
        }),
      });
      expect(review).toEqual(mockReview);
    });

    it('should throw an error if fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => 'token123');

      await expect(reviewApi.updateReview('1', 4, 'Good product', 'I like this product'))
        .rejects.toThrow('Failed to update review');
    });
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Review deleted successfully' }),
      });

      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => 'token123');

      const result = await reviewApi.deleteReview('1');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/reviews/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123',
        },
      });
      expect(result).toEqual({ message: 'Review deleted successfully' });
    });

    it('should throw an error if fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => 'token123');

      await expect(reviewApi.deleteReview('1')).rejects.toThrow('Failed to delete review');
    });
  });

  describe('markHelpful', () => {
    it('should mark a review as helpful', async () => {
      const mockReview = {
        id: '1',
        userId: 'user1',
        user: { id: 'user1', name: 'John Doe' },
        rating: 5,
        title: 'Great product',
        comment: 'I love this product',
        isVerifiedPurchase: true,
        helpfulCount: 11,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockReview,
      });

      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => 'token123');

      const review = await reviewApi.markHelpful('1');
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/reviews/1/helpful', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123',
        },
      });
      expect(review).toEqual(mockReview);
    });

    it('should throw an error if fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => 'token123');

      await expect(reviewApi.markHelpful('1')).rejects.toThrow('Failed to mark review as helpful');
    });
  });
});