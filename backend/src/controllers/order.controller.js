import prisma from '../utils/prisma.js';

const formatOrder = (order) => ({
    id: order.id,
    date: order.createdAt,
    status: order.status,
    userId: order.userId,
    totalPrice: Number(order.total),
    customer: order.customerName || order.customerPhone ? {
        name: order.customerName || '',
        phone: order.customerPhone || ''
    } : null,
    address: order.address ?? null,
    payment: order.paymentMethod ?? null,
    comment: order.comment ?? null,
    items: order.items.map(item => ({
        id: item.productId,
        name: item.product.name,
        image: item.product.images[0],
        price: Number(item.price),
        quantity: item.quantity
    }))
});

const formatAdminOrder = (order) => ({
    ...formatOrder(order),
    customer: {
        name:
            order.customerName ||
            `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() ||
            order.user?.email ||
            '',
        phone: order.customerPhone || order.user?.phone || ''
    },
    user: order.user
        ? {
            id: order.user.id,
            firstName: order.user.firstName,
            lastName: order.user.lastName,
            email: order.user.email,
            phone: order.user.phone
        }
        : null
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
    try {
        const { items, customer, address, paymentMethod, comment } = req.body;

        if (!items || items.length === 0) {
            const error = new Error('No order items');
            error.statusCode = 400;
            throw error;
        }

        if (address && typeof address !== 'object') {
            const error = new Error('Address must be an object');
            error.statusCode = 400;
            throw error;
        }

        // 1. Calculate total price and verify products
        let total = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                const error = new Error(`Product not found: ${item.productId}`);
                error.statusCode = 404;
                throw error;
            }

            const itemTotal = Number(product.price) * item.quantity;
            total += itemTotal;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price // Store the price at time of purchase
            });
        }

        // 2. Create Order in Transaction
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                total: total,
                customerName: customer?.name || `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || null,
                customerPhone: customer?.phone || null,
                paymentMethod: paymentMethod || null,
                comment: comment || null,
                address: address || undefined,
                items: {
                    create: orderItemsData
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            data: formatOrder(order)
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedOrders = orders.map(formatOrder);

        res.status(200).json({
            success: true,
            count: orders.length,
            data: formattedOrders
        });
    } catch (error) {
        next(error);
    }
};

export const getUserOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findFirst({
            where: {
                id,
                userId: req.user.id
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: formatOrder(order)
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminOrders = async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders.map(formatAdminOrder)
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: formatAdminOrder(order)
        });
    } catch (error) {
        next(error);
    }
};

export const updateAdminOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const allowedStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

        if (!allowedStatuses.includes(status)) {
            const error = new Error('Invalid order status');
            error.statusCode = 400;
            throw error;
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                },
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            data: formatAdminOrder(order)
        });
    } catch (error) {
        next(error);
    }
};
