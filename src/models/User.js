import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        photoURL: {
            type: String,
            default: null,
        },

        phone: {
            type: String,
            default: null,
            trim: true,
        },

        role: {
            type: String,
            enum: [
                "user",
                "rider",
                "admin",
            ],
            default: "user",
        },

        status: {
            type: String,
            enum: [
                "active",
                "blocked",
            ],
            default: "active",
        },

        lastLoginAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const User =
    mongoose.models.User ||
    mongoose.model(
        "User",
        userSchema
    );

export default User;