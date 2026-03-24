import express from 'express';
import { syncCart, getCart } from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/sync', protect, syncCart);

export default router;
