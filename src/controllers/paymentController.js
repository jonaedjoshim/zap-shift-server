import Payment from "../models/Payment.js";
import Parcel from "../models/Parcel.js";
import generateTransactionId from "../utils/generateTransactionId.js";

export const processPayment = async (req, res, next) => {
    try {
        const { parcelId, paymentMethod } = req.body;

        if (!parcelId) {
            return res.status(400).json({
                success: false,
                message: "Parcel ID is required.",
            });
        }

        const parcel = await Parcel.findById(parcelId);

        if (!parcel) {
            return res.status(404).json({
                success: false,
                message: "Parcel not found.",
            });
        }

        if (parcel.createdBy !== req.user.email) {
            return res.status(403).json({
                success: false,
                message: "You can only pay for your own parcels.",
            });
        }

        if (parcel.pricing.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "This parcel is already paid.",
            });
        }

        const transactionId = generateTransactionId();

        const payment = await Payment.create({
            parcelId: parcel._id,
            trackingId: parcel.trackingId,
            userEmail: req.user.email,
            amount: parcel.pricing.amount,
            paymentMethod: paymentMethod || "card",
            transactionId,
            paidAt: new Date(),
        });

        // Update Parcel Payment Status & Tracking History
        parcel.pricing.paymentStatus = "paid";
        parcel.shipment.status = "confirmed";
        parcel.trackingHistory.push({
            status: "confirmed",
            message: `Payment of ৳${parcel.pricing.amount} received via ${paymentMethod ? paymentMethod.toUpperCase() : "CARD"}. Transaction ID: ${transactionId}`,
            timestamp: new Date(),
        });

        await parcel.save();

        return res.status(200).json({
            success: true,
            message: "Payment processed successfully.",
            data: {
                payment,
                parcel,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getMyPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({ userEmail: req.user.email })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        next(error);
    }
};