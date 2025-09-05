import { Router } from 'express';
import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createAddress);
router.get('/', authMiddleware, getAddresses);
router.get('/:id', authMiddleware, getAddressById);
router.put('/:id', authMiddleware, updateAddress);
router.delete('/:id', authMiddleware, deleteAddress);

export default router;