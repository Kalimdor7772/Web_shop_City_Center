import express from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';
import cartRoutes from './cart.routes.js';
import aiRoutes from './ai.routes.js';

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ status: "OK", message: "Backend is running" });
});

router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/ai', aiRoutes);
router.use('/', productRoutes);

export default router;
