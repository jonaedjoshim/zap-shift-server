import "dotenv/config";
import dns from "node:dns";

if (
    process.env.USE_CUSTOM_DNS === "true"
) {
    dns.setServers([
        "1.1.1.1",
        "8.8.8.8",
    ]);
}

const startServer = async () => {
    try {
        const { default: app } =
            await import("./src/app.js");

        const { default: connectDB } =
            await import("./src/config/db.js");

        await connectDB();

        const PORT =
            process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(
                `ZapShift server running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Failed to start ZapShift server:",
            error.message
        );

        process.exit(1);
    }
};

startServer();