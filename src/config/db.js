import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined.");
    }

    if (mongoose.connection.readyState >= 1) {
        return;
    }

    return mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, 
    });
};

export default connectDB;