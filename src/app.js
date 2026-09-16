import cors from "cors";
import express from "express";

import adminRoutes from "./routes/adminRoutes.js";
import parcelRoutes from "./routes/parcelRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://zap-shift-mj.vercel.app",
    "http://localhost:5173",
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json());

app.get(["/", "/api"], (req, res) => {
    res.status(200).json({
        success: true,
        message: "ZapShift API is running.",
    });
});

app.get(["/api/health", "/health"], (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

app.use(["/api/users", "/users"], userRoutes);
app.use(["/api/parcels", "/parcels"], parcelRoutes);
app.use(["/api/payments", "/payments"], paymentRoutes);
app.use(["/api/riders", "/riders"], riderRoutes);
app.use(["/api/admin", "/admin"], adminRoutes);
app.use(["/api/reviews", "/reviews"], reviewRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found.",
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((item) => item.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", ") || "Validation failed.",
            errors: messages,
        });
    }

    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate entry detected.",
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error.",
    });
});

export default app;