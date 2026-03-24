import prisma from '../utils/prisma.js';
import { formatProductWeight } from '../utils/productFormat.js';

const formatCartProduct = (product, quantity) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    description: product.description,
    category: product.category?.name || '',
    subcategory: product.category?.name || '',
    brand: product.manufacturer?.name || '',
    country: product.manufacturer?.country || '',
    image: product.images?.[0] || '',
    images: product.images || [],
    stock: product.stock,
    weight: formatProductWeight(product),
    nutrition: {
        calories: product.calories,
        protein: product.protein,
        fat: product.fat,
        carbs: product.carbs,
        servingGrams: product.servingGrams,
        basis: product.nutritionBasis
    },
    quantity
});

// @desc    Sync cart items
// @route   POST /api/cart/sync
// @access  Private
export const syncCart = async (req, res, next) => {
    try {
        const { items } = req.body;

        if (!items) {
            const error = new Error('Items are required');
            error.statusCode = 400;
            throw error;
        }

        // 1. Find or Create Cart
        let cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: { items: true }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.user.id }
            });
        }

        // 2. Clear existing items and add new ones (Simplified Sync)
        // In a real production app, we might want to be more surgical, 
        // but for a full state sync, this is robust.
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        const createdItems = await prisma.cartItem.createMany({
            data: items.map(item => ({
                cartId: cart.id,
                productId: item.id,
                quantity: item.quantity
            }))
        });

        res.status(200).json({
            success: true,
            data: {
                message: "Cart synced successfully",
                count: items.length
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get cart items
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true,
                                manufacturer: true
                            }
                        }
                    }
                }
            }
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        // Normalize nested Prisma relations to the same flat shape used by product endpoints.
        const formattedItems = cart.items.map(item => formatCartProduct(item.product, item.quantity));

        res.status(200).json({
            success: true,
            data: formattedItems
        });

    } catch (error) {
        next(error);
    }
};
