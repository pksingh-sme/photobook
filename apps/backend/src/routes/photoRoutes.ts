import { Router } from 'express';
import {
  uploadPhoto,
  getPhotos,
  getPhotoById,
  deletePhoto,
  uploadMiddleware,
} from '../controllers/photoController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, uploadMiddleware, uploadPhoto);
router.get('/', authMiddleware, getPhotos);
router.get('/:id', authMiddleware, getPhotoById);
router.delete('/:id', authMiddleware, deletePhoto);

export default router;