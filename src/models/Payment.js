import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        parcelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parcel",
            required: true,
        },
        trackingId: {
            type: String,
            required: true,
            trim: true,
        },
        userEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            enum: ["card", "bkash", "nagad"],
            default: "card",
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        paidAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Payment =
    mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;