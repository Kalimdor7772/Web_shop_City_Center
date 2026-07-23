import express from 'express';
import { chatWithAI } from '../controllers/ai.controller.js';
import { createRateLimiter } from '../middlewares/security.middleware.js';

const router = express.Router();
const aiRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many AI requests. Please slow down and try again shortly.",
});

router.post('/chat', aiRateLimiter, chatWithAI);

export default router;
