import express from 'express';
import {
  getStats,
  getSalesData,
  getUserActivity,
  getTopProducts,
  getOrderStats,
} from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All analytics routes require authentication
router.use(authenticateToken);

// Get overall stats
router.get('/stats', getStats);

// Get sales data
router.get('/sales', getSalesData);

// Get user activity
router.get('/user-activity', getUserActivity);

// Get top products
router.get('/top-products', getTopProducts);

// Get order stats
router.get('/orders', getOrderStats);

export default router;