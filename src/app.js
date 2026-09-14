import cors from "cors";
import express from "express";

import adminRoutes from "./routes/adminRoutes.js";
import parcelRoutes from "./routes/parcelRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "ZapShift API is running.",
    });
});

app.get(
    "/api/health",
    (req, res) => {
        res.status(200).json({
            success: true,
            status: "healthy",
            timestamp:
                new Date().toISOString(),
        });
    }
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/parcels",
    parcelRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message:
            "API endpoint not found.",
    });
});

app.use(
    (error, req, res, next) => {
        console.error(error);

        if (
            error.name ===
            "ValidationError"
        ) {
            return res
                .status(400)
                .json({
                    success: false,
                    message:
                        "Validation failed.",
                    errors:
                        Object.values(
                            error.errors
                        ).map(
                            (item) =>
                                item.message
                        ),
                });
        }

        if (error.code === 11000) {
            return res
                .status(409)
                .json({
                    success: false,
                    message:
                        "Duplicate data detected.",
                });
        }

        return res.status(500).json({
            success: false,
            message:
                "Internal server error.",
        });
    }
);

export default app;