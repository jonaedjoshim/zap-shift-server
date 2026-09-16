import "dotenv/config";
import dns from "node:dns";

if (process.env.USE_CUSTOM_DNS === "true") {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

// Database Connection for Serverless Execution
let isConnected = false;
const ensureDbConnected = async () => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
};

// Middleware to ensure DB connection on Vercel requests
app.use(async (req, res, next) => {
    try {
        await ensureDbConnected();
        next();
    } catch (error) {
        console.error("DB connection error in serverless execution:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed.",
        });
    }
});

// For Local Development Server
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`ZapShift local server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel Serverless
export default app;