import { Router } from 'express';
import {
  createAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
} from '../controllers/albumController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createAlbum);
router.get('/', authMiddleware, getAlbums);
router.get('/:id', authMiddleware, getAlbumById);
router.put('/:id', authMiddleware, updateAlbum);
router.delete('/:id', authMiddleware, deleteAlbum);

export default router;