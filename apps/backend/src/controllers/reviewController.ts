import { Request, Response } from 'express';
import { reviewService } from '../services/reviewService';

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const reviews = await reviewService.getReviews(productId as string);
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = (req as any).userId;

    const review = await reviewService.createReview(userId, productId, rating, title, comment);
    res.status(201).json(review);
  } catch (error: any) {
    console.error('Create review error:', error);
    if (error.message === 'You have already reviewed this product') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === 'You must purchase this product to review it') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = (req as any).userId;

    const updatedReview = await reviewService.updateReview(id, userId, rating, title, comment);
    res.json(updatedReview);
  } catch (error: any) {
    console.error('Update review error:', error);
    if (error.message === 'Review not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Not authorized to update this review') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const result = await reviewService.deleteReview(id, userId);
    res.json(result);
  } catch (error: any) {
    console.error('Delete review error:', error);
    if (error.message === 'Review not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Not authorized to delete this review') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const markHelpful = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const review = await reviewService.markHelpful(id, userId);
    res.json(review);
  } catch (error: any) {
    console.error('Mark helpful error:', error);
    if (error.message === 'You have already marked this review as helpful') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};