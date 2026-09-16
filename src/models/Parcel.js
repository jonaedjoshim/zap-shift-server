import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        contact: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        region: { type: String, required: true, trim: true },
        warehouse: { type: String, required: true, trim: true },
        instruction: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const parcelInfoSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ["document", "non-document"], required: true },
        name: { type: String, required: true, trim: true },
        weight: { type: Number, default: null },
    },
    { _id: false }
);

const pricingSchema = new mongoose.Schema(
    {
        amount: { type: Number, required: true, min: 0 },
        currency: { type: String, default: "BDT", enum: ["BDT"] },
        paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    },
    { _id: false }
);

const shipmentSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ["pending", "confirmed", "picked-up", "in-transit", "at-warehouse", "out-for-delivery", "delivered", "cancelled"],
            default: "pending",
        },
        riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        deliveredAt: { type: Date, default: null },
    },
    { _id: false }
);

const trackingEventSchema = new mongoose.Schema(
    {
        status: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false }
);

const parcelSchema = new mongoose.Schema(
    {
        trackingId: { type: String, required: true, unique: true, index: true, trim: true },
        deliveryOTP: { type: String, required: true }, // New OTP field
        parcel: { type: parcelInfoSchema, required: true },
        sender: { type: contactSchema, required: true },
        receiver: { type: contactSchema, required: true },
        pricing: { type: pricingSchema, required: true },
        shipment: { type: shipmentSchema, default: () => ({ status: "pending" }) },
        trackingHistory: { type: [trackingEventSchema], default: [] },
        createdBy: { type: String, required: true, lowercase: true, trim: true, index: true },
    },
    { timestamps: true }
);

const Parcel = mongoose.models.Parcel || mongoose.model("Parcel", parcelSchema);
export default Parcel;