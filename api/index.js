import "dotenv/config";
import dns from "node:dns";

if (process.env.USE_CUSTOM_DNS === "true") {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

let isConnected = false;

export default async function handler(req, res) {
    try {
        if (!isConnected) {
            await connectDB();
            isConnected = true;
        }
        return app(req, res);
    } catch (error) {
        console.error("Vercel Serverless Handler Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during DB connection.",
        });
    }
}