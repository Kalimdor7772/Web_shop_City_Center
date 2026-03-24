import prisma from '../utils/prisma.js';
import { formatProductWeight } from '../utils/productFormat.js';

const formatNutrition = (product) => ({
    calories: product.calories,
    protein: product.protein,
    fat: product.fat,
    carbs: product.carbs,
    servingGrams: product.servingGrams,
    basis: product.nutritionBasis
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
    try {
        const { categoryId, category, manufacturer, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const filterObj = {};
        if (categoryId) {
            filterObj.categoryId = categoryId;
        }
        if (category) {
            filterObj.category = { name: category };
        }
        if (manufacturer) {
            filterObj.manufacturer = { name: manufacturer };
        }

        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
                where: filterObj,
                skip: skip,
                take: take,
                include: {
                    category: true,
                    manufacturer: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.product.count({ where: filterObj })
        ]);

        const formattedProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            description: p.description,
            category: p.category.name,
            subcategory: p.category.name, // Fallback
            brand: p.manufacturer.name,
            country: p.manufacturer.country,
            image: p.images[0],
            images: p.images,
            rating: 4.8, // Fallback if no reviews
            stock: p.stock,
            weight: formatProductWeight(p),
            nutrition: formatNutrition(p)
        }));

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / take)
            },
            data: formattedProducts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                manufacturer: true,
                reviews: {
                    include: {
                        user: {
                            select: { id: true, firstName: true, lastName: true }
                        }
                    }
                }
            }
        });

        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        const formattedProduct = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            description: product.description,
            category: product.category.name,
            subcategory: product.category.name,
            brand: product.manufacturer.name,
            country: product.manufacturer.country,
            image: product.images[0],
            images: product.images,
            rating: 4.8,
            stock: product.stock,
            weight: formatProductWeight(product),
            nutrition: formatNutrition(product),
            reviews: product.reviews
        };

        res.status(200).json({
            success: true,
            data: formattedProduct
        });
    } catch (error) {
        next(error);
    }
};
