const buildAllowedOrigins = () =>
    String(process.env.FRONTEND_URL || "")
        .split(",")
        .map((value) => value.trim().replace(/\/$/, ""))
        .filter(Boolean);

export const createCorsOptions = () => {
    const allowedOrigins = buildAllowedOrigins();
    const isProd = process.env.NODE_ENV === "production";
    const devOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ];
    const effectiveAllowedOrigins = isProd
        ? allowedOrigins
        : [...new Set([...allowedOrigins, ...devOrigins])];

    return {
        origin(origin, callback) {
            if (!origin) {
                callback(null, true);
                return;
            }

            const normalizedOrigin = origin.replace(/\/$/, "");
            const isLocalDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizedOrigin);
            if (
                (!isProd && isLocalDevOrigin) ||
                effectiveAllowedOrigins.length === 0 ||
                effectiveAllowedOrigins.includes(normalizedOrigin)
            ) {
                callback(null, true);
                return;
            }

            callback(new Error("CORS blocked for this origin"));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 204,
    };
};

export const securityHeaders = (_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
};

export const requireStrongJwtSecret = () => {
    const secret = process.env.JWT_SECRET || "";
    if (secret.length < 32) {
        throw new Error("JWT_SECRET must be at least 32 characters long");
    }
};

export const createRateLimiter = ({ windowMs, max, message }) => {
    const hits = new Map();

    return (req, res, next) => {
        const key = `${req.ip}:${req.originalUrl}`;
        const now = Date.now();
        const entry = hits.get(key);

        if (!entry || now > entry.expiresAt) {
            hits.set(key, { count: 1, expiresAt: now + windowMs });
            next();
            return;
        }

        if (entry.count >= max) {
            res.status(429).json({
                success: false,
                message,
            });
            return;
        }

        entry.count += 1;
        next();
    };
};
