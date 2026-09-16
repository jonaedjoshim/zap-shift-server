import Parcel from "../models/Parcel.js";
import User from "../models/User.js";
import calculateParcelCost from "../utils/calculateParcelCost.js";
import generateTrackingId from "../utils/generateTrackingId.js";

// Generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const createParcel = async (req, res, next) => {
    try {
        const data = req.body;
        if (!req.user?.email) {
            return res.status(401).json({ success: false, message: "Authenticated user email is required." });
        }

        const cost = calculateParcelCost({
            parcelType: data.parcelType,
            weight: data.parcelWeight,
            senderRegion: data.senderRegion,
            receiverRegion: data.receiverRegion,
        });

        if (cost === null) {
            return res.status(400).json({ success: false, message: "Invalid parcel information for pricing." });
        }

        const trackingId = generateTrackingId();
        const deliveryOTP = generateOTP(); // OTP generated

        const parcelWeight = data.parcelType === "document" ? null : Number(data.parcelWeight);

        const parcel = await Parcel.create({
            trackingId,
            deliveryOTP, // Save OTP to DB
            parcel: { type: data.parcelType, name: data.parcelName, weight: parcelWeight },
            sender: {
                name: data.senderName, contact: data.senderContact, address: data.senderAddress,
                region: data.senderRegion, warehouse: data.senderWarehouse, instruction: data.pickupInstruction,
            },
            receiver: {
                name: data.receiverName, contact: data.receiverContact, address: data.receiverAddress,
                region: data.receiverRegion, warehouse: data.receiverWarehouse, instruction: data.deliveryInstruction,
            },
            pricing: { amount: cost, currency: "BDT", paymentStatus: "unpaid" },
            shipment: { status: "pending" },
            trackingHistory: [{ status: "pending", message: "Parcel booking created." }],
            createdBy: req.user.email,
        });

        return res.status(201).json({
            success: true,
            message: "Parcel created successfully.",
            data: {
                id: parcel._id,
                trackingId: parcel.trackingId,
                deliveryOTP: parcel.deliveryOTP, // Return OTP to frontend
                cost: parcel.pricing.amount,
                currency: parcel.pricing.currency,
                paymentStatus: parcel.pricing.paymentStatus,
                deliveryStatus: parcel.shipment.status,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getMyParcels = async (req, res, next) => {
    try {
        const parcels = await Parcel.find({ createdBy: req.user.email }).sort({ createdAt: -1 }).lean();
        return res.status(200).json({ success: true, count: parcels.length, data: parcels });
    } catch (error) {
        next(error);
    }
};

export const getParcelByTrackingId = async (req, res, next) => {
    try {
        const parcel = await Parcel.findOne({ trackingId: req.params.trackingId.trim().toUpperCase() }).lean();
        if (!parcel) return res.status(404).json({ success: false, message: "Parcel not found." });

        // Hide OTP from public tracking API
        delete parcel.deliveryOTP;

        return res.status(200).json({ success: true, data: parcel });
    } catch (error) {
        next(error);
    }
};

export const assignRiderToParcel = async (req, res, next) => {
    try {
        const { parcelId } = req.params;
        const { riderId } = req.body;

        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ success: false, message: "Parcel not found." });

        if (parcel.pricing?.paymentStatus !== "paid") {
            return res.status(400).json({ success: false, message: "Only paid parcels can be assigned to a rider." });
        }

        const rider = await User.findOne({ _id: riderId, role: "rider", status: "active" });
        if (!rider) return res.status(404).json({ success: false, message: "Active rider not found." });

        parcel.shipment.riderId = rider._id;
        parcel.shipment.status = "picked-up";
        parcel.trackingHistory.push({
            status: "picked-up",
            message: `Rider assigned: ${rider.name}. Parcel is ready for pickup.`,
            timestamp: new Date(),
        });

        await parcel.save();
        return res.status(200).json({ success: true, message: "Rider assigned successfully." });
    } catch (error) {
        next(error);
    }
};