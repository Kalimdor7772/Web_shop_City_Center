import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const TOKEN_COOKIE_NAME = 'auth_token';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '12h',
    });
};

const buildCookieOptions = () => ({
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 12 * 60 * 60 * 1000,
});

const attachAuthCookie = (res, token) => {
    res.cookie(TOKEN_COOKIE_NAME, token, buildCookieOptions());
};

const clearAuthCookie = (res) => {
    res.clearCookie(TOKEN_COOKIE_NAME, {
        ...buildCookieOptions(),
        maxAge: undefined,
    });
};

const normalizeUser = (user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    profile: user.profile ?? {},
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, phone, avatar, profile } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        if (String(password).length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        const userExists = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (userExists) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email: normalizedEmail,
                password: hashedPassword,
                phone: phone || null,
                avatar: avatar || null,
                profile: profile || undefined,
            },
        });

        const token = generateToken(user.id);
        attachAuthCookie(res, token);

        res.status(201).json({
            success: true,
            data: {
                ...normalizeUser(user),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();

        if (!normalizedEmail || !password) {
            const error = new Error('Пожалуйста, введите email и пароль');
            error.statusCode = 400;
            throw error;
        }

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user.id);
            attachAuthCookie(res, token);

            res.status(200).json({
                success: true,
                data: {
                    ...normalizeUser(user),
                },
            });
        } else {
            const error = new Error('Пароль или логин не совпадают. Повторите попытку.');
            error.statusCode = 401;
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: normalizeUser(user)
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, avatar, profile } = req.body;
        const normalizedEmail = email ? String(email).trim().toLowerCase() : undefined;

        const existingUser = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                profile: true
            }
        });

        const mergedProfile = profile
            ? {
                ...(existingUser?.profile && typeof existingUser.profile === 'object' ? existingUser.profile : {}),
                ...profile
            }
            : undefined;

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                email: normalizedEmail || undefined,
                phone: phone || undefined,
                avatar: avatar || undefined,
                profile: mergedProfile || undefined,
            }
        });

        res.status(200).json({
            success: true,
            data: normalizeUser(user)
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (_req, res) => {
    clearAuthCookie(res);
    res.status(200).json({
        success: true,
        message: 'Logged out',
    });
};
