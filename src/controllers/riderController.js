import RiderApplication from "../models/RiderApplication.js";
import User from "../models/User.js";
import Parcel from "../models/Parcel.js";

// Submit a new rider application
export const applyForRider = async (req, res, next) => {
    try {
        const { nidNumber, drivingLicense, preferredRegion, vehicleType, phone } = req.body;

        const existingUser = await User.findOne({ firebaseUid: req.user.uid });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User profile not found.",
            });
        }

        if (existingUser.role === "rider") {
            return res.status(400).json({
                success: false,
                message: "You are already a registered rider.",
            });
        }

        const existingApp = await RiderApplication.findOne({ userId: existingUser._id });

        if (existingApp && existingApp.status === "pending") {
            return res.status(400).json({
                success: false,
                message: "You already have a pending rider application.",
            });
        }

        const application = await RiderApplication.create({
            userId: existingUser._id,
            userEmail: existingUser.email,
            name: existingUser.name,
            phone: phone || existingUser.phone || "N/A",
            nidNumber,
            drivingLicense,
            preferredRegion,
            vehicleType: vehicleType || "bike",
            status: "pending",
        });

        return res.status(201).json({
            success: true,
            message: "Rider application submitted successfully.",
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

// Get current user's rider application status
export const getMyRiderApplication = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ firebaseUid: req.user.uid });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User profile not found.",
            });
        }

        const application = await RiderApplication.findOne({ userId: existingUser._id }).lean();

        return res.status(200).json({
            success: true,
            data: application || null,
        });
    } catch (error) {
        next(error);
    }
};

// Rider: Get parcels assigned to current rider
export const getMyDeliveries = async (req, res, next) => {
    try {
        const currentUser = await User.findOne({ firebaseUid: req.user.uid });

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User profile not found.",
            });
        }

        const parcels = await Parcel.find({ "shipment.riderId": currentUser._id })
            .sort({ updatedAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: parcels.length,
            data: parcels,
        });
    } catch (error) {
        next(error);
    }
};

// Rider: Get rider earnings & statistics
export const getRiderStats = async (req, res, next) => {
    try {
        const currentUser = await User.findOne({ firebaseUid: req.user.uid });

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User profile not found.",
            });
        }

        const parcels = await Parcel.find({ "shipment.riderId": currentUser._id }).lean();

        let totalDelivered = 0;
        let totalPending = 0;
        let totalEarnings = 0;

        const earningsHistory = [];

        parcels.forEach((p) => {
            if (p.shipment?.status === "delivered") {
                totalDelivered++;

                const isSameRegion = p.sender?.region === p.receiver?.region;
                const commissionRate = isSameRegion ? 0.8 : 0.6; // 80% same city, 60% outside
                const earning = (p.pricing?.amount || 0) * commissionRate;

                totalEarnings += earning;

                earningsHistory.push({
                    parcelId: p._id,
                    trackingId: p.trackingId,
                    parcelName: p.parcel?.name,
                    totalCharge: p.pricing?.amount,
                    commissionRate: isSameRegion ? "80% (Inside City)" : "60% (Outside City)",
                    earning,
                    deliveredAt: p.shipment?.deliveredAt || p.updatedAt,
                });
            } else if (p.shipment?.status !== "cancelled") {
                totalPending++;
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                totalAssigned: parcels.length,
                totalDelivered,
                totalPending,
                totalEarnings,
                earningsHistory,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get all rider applications
export const getAllRiderApplications = async (req, res, next) => {
    try {
        const applications = await RiderApplication.find()
            .populate("userId", "name email photoURL role")
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Update application status (Approve/Reject)
export const updateRiderApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed: 'approved' or 'rejected'.",
            });
        }

        const application = await RiderApplication.findById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
        }

        application.status = status;
        await application.save();

        if (status === "approved") {
            await User.findByIdAndUpdate(application.userId, { role: "rider" });
        }

        return res.status(200).json({
            success: true,
            message: `Application ${status} successfully.`,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};