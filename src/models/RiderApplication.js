import mongoose from "mongoose";

const riderApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        nidNumber: {
            type: String,
            required: true,
            trim: true,
        },
        drivingLicense: {
            type: String,
            required: true,
            trim: true,
        },
        preferredRegion: {
            type: String,
            required: true,
            trim: true,
        },
        vehicleType: {
            type: String,
            enum: ["bike", "bicycle", "scooter", "van"],
            default: "bike",
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const RiderApplication =
    mongoose.models.RiderApplication ||
    mongoose.model("RiderApplication", riderApplicationSchema);

export default RiderApplication;