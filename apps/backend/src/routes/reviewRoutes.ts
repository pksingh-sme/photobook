import { Router } from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} from '../controllers/reviewController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getReviews);
router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);
router.post('/:id/helpful', authMiddleware, markHelpful);

export default router;