import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

const TOKEN_COOKIE_NAME = 'auth_token';

const getCookieToken = (cookieHeader = '') => {
    const cookies = cookieHeader.split(';').map((part) => part.trim());
    const tokenCookie = cookies.find((part) => part.startsWith(`${TOKEN_COOKIE_NAME}=`));
    return tokenCookie ? decodeURIComponent(tokenCookie.split('=').slice(1).join('=')) : null;
};

const protect = async (req, res, next) => {
    let token =
        getCookieToken(req.headers.cookie) ||
        null;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true
                }
            });

            if (!req.user) {
                const error = new Error('Not authorized, user not found');
                error.statusCode = 401;
                throw error;
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authorized as an admin'
        });
    }
};

export { protect, admin };
