import cors from "cors";
import express from "express";

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
        message: "ZapShift API is running.",
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found.",
    });
});

export default app;