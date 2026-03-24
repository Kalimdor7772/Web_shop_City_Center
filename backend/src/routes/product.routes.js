import express from 'express';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

router.get('/categories', productController.getCategories);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

export default router;
