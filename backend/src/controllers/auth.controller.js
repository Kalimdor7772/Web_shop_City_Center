import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
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

      if (!email || !password) {
  return res.status(400).json({
    success: false,
    message: "Please provide email and password"
  });
}

        const userExists = await prisma.user.findUnique({
            where: { email }
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
                email,
                password: hashedPassword,
                phone: phone || null,
                avatar: avatar || null,
                profile: profile || undefined,
            },
        });

        res.status(201).json({
            success: true,
            data: {
                ...normalizeUser(user),
                token: generateToken(user.id),
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

        if (!email || !password) {
            const error = new Error('Please provide email and password');
            error.statusCode = 400;
            throw error;
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                success: true,
                data: {
                    ...normalizeUser(user),
                    token: generateToken(user.id),
                },
            });
        } else {
            const error = new Error('Invalid credentials');
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
                email: email || undefined,
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
