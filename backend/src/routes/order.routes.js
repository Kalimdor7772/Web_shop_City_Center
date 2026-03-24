import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/admin/all', protect, admin, orderController.getAdminOrders);
router.get('/admin/:id', protect, admin, orderController.getAdminOrderById);
router.patch('/admin/:id/status', protect, admin, orderController.updateAdminOrderStatus);
router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getUserOrderById);

export default router;
