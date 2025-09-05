import { Router } from 'express';
import {
  createDesign,
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
} from '../controllers/designController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createDesign);
router.get('/', authMiddleware, getDesigns);
router.get('/:id', authMiddleware, getDesignById);
router.put('/:id', authMiddleware, updateDesign);
router.delete('/:id', authMiddleware, deleteDesign);

export default router;