import { Prisma } from "@prisma/client";

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 404;
            message = "Resource not found";
        } else if (err.code === "P2002") {
            statusCode = 409;
            message = "Conflict: duplicate value";
        } else if (err.code === "P2023") {
            statusCode = 400;
            message = "Invalid identifier";
        }
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        data: null
    });
};

export default errorHandler;
