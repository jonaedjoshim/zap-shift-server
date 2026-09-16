import "dotenv/config";
import dns from "node:dns";

// Fix local DNS issue for MongoDB Atlas if enabled in .env
if (process.env.USE_CUSTOM_DNS === "true") {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

// Ensure DB connection is maintained across requests (for Vercel & Local)
let isConnected = false;
const ensureDbConnected = async () => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
};

// Middleware to ensure DB connection before processing any API request
app.use(async (req, res, next) => {
    try {
        await ensureDbConnected();
        next();
    } catch (error) {
        console.error("Database connection middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to connect to the database.",
        });
    }
});

// Start server for Local Development
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    const startLocalServer = async () => {
        try {
            await ensureDbConnected();
            app.listen(PORT, () => {
                console.log(`ZapShift local server running on http://localhost:${PORT}`);
            });
        } catch (error) {
            console.error("Failed to start local server:", error.message);
        }
    };
    startLocalServer();
}

// Export express app for Vercel Serverless execution
export default app;