import 'dotenv/config';
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import prisma from "./utils/prisma.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;
let server;

const start = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected");

        server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        server.on("error", (error) => {
            console.error("Server failed to start:", error);
            process.exit(1);
        });
    } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
};

const shutdown = async () => {
    if (server) {
        server.close();
    }
    await prisma.$disconnect();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
