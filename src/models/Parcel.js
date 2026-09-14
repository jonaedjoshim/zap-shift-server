import mongoose from "mongoose";

const trackingEventSchema =
    new mongoose.Schema(
        {
            status: {
                type: String,
                required: true,
                trim: true,
            },

            message: {
                type: String,
                required: true,
                trim: true,
            },

            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
        {
            _id: false,
        }
    );

const parcelSchema =
    new mongoose.Schema(
        {
            trackingId: {
                type: String,
                required: true,
                unique: true,
                index: true,
                trim: true,
            },

            parcelType: {
                type: String,
                enum: [
                    "document",
                    "non-document",
                ],
                required: true,
            },

            parcelName: {
                type: String,
                required: true,
                trim: true,
            },

            parcelWeight: {
                type: Number,
                default: null,
            },

            cost: {
                type: Number,
                required: true,
                min: 0,
            },

            senderName: {
                type: String,
                required: true,
                trim: true,
            },

            senderContact: {
                type: String,
                required: true,
                trim: true,
            },

            senderAddress: {
                type: String,
                required: true,
                trim: true,
            },

            senderRegion: {
                type: String,
                required: true,
                trim: true,
            },

            senderWarehouse: {
                type: String,
                required: true,
                trim: true,
            },

            pickupInstruction: {
                type: String,
                required: true,
                trim: true,
            },

            receiverName: {
                type: String,
                required: true,
                trim: true,
            },

            receiverContact: {
                type: String,
                required: true,
                trim: true,
            },

            receiverAddress: {
                type: String,
                required: true,
                trim: true,
            },

            receiverRegion: {
                type: String,
                required: true,
                trim: true,
            },

            receiverWarehouse: {
                type: String,
                required: true,
                trim: true,
            },

            deliveryInstruction: {
                type: String,
                required: true,
                trim: true,
            },

            createdBy: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
            },

            paymentStatus: {
                type: String,
                enum: [
                    "unpaid",
                    "paid",
                    "refunded",
                ],
                default: "unpaid",
            },

            deliveryStatus: {
                type: String,
                enum: [
                    "pending",
                    "confirmed",
                    "picked-up",
                    "in-transit",
                    "at-warehouse",
                    "out-for-delivery",
                    "delivered",
                    "cancelled",
                ],
                default: "pending",
            },

            trackingHistory: {
                type: [trackingEventSchema],
                default: [],
            },
        },
        {
            timestamps: true,
        }
    );

const Parcel =
    mongoose.models.Parcel ||
    mongoose.model(
        "Parcel",
        parcelSchema
    );

export default Parcel;