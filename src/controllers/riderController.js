import RiderApplication from "../models/RiderApplication.js";
import User from "../models/User.js";
import Parcel from "../models/Parcel.js";

// ... (applyForRider, getMyRiderApplication, getMyDeliveries, getRiderStats unchanged)
export const applyForRider = async (req, res, next) => { /* unchanged */ };
export const getMyRiderApplication = async (req, res, next) => { /* unchanged */ };
export const getMyDeliveries = async (req, res, next) => { /* unchanged */ };
export const getRiderStats = async (req, res, next) => { /* unchanged */ };
export const getAllRiderApplications = async (req, res, next) => { /* unchanged */ };
export const updateRiderApplicationStatus = async (req, res, next) => { /* unchanged */ };


// Rider: Update status of an assigned parcel WITH OTP VERIFICATION
export const updateDeliveryStatus = async (req, res, next) => {
    try {
        const { parcelId } = req.params;
        const { status, message, otp } = req.body; // added otp in body

        const allowedStatuses = ["in-transit", "at-warehouse", "out-for-delivery", "delivered", "cancelled"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value provided." });
        }

        const currentUser = await User.findOne({ firebaseUid: req.user.uid });

        const parcel = await Parcel.findOne({ _id: parcelId, "shipment.riderId": currentUser._id });
        if (!parcel) return res.status(404).json({ success: false, message: "Parcel not found or not assigned to you." });

        if (parcel.shipment?.status === "delivered") {
            return res.status(400).json({ success: false, message: "Parcel is already delivered." });
        }

        // OTP Verification ONLY when status is "delivered"
        if (status === "delivered") {
            if (!otp) return res.status(400).json({ success: false, message: "Delivery OTP is required for final delivery." });
            if (otp !== parcel.deliveryOTP) {
                return res.status(400).json({ success: false, message: "Invalid Delivery OTP! Please check with the receiver." });
            }
            parcel.shipment.deliveredAt = new Date();
        }

        parcel.shipment.status = status;
        parcel.trackingHistory.push({
            status,
            message: message || `Status updated to ${status}`,
            timestamp: new Date(),
        });

        await parcel.save();
        return res.status(200).json({ success: true, message: `Parcel status updated to '${status}'.`, data: parcel });
    } catch (error) {
        next(error);
    }
};