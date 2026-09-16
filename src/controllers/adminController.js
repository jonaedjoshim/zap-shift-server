import User from "../models/User.js";
import Parcel from "../models/Parcel.js";
import Payment from "../models/Payment.js";
import RiderApplication from "../models/RiderApplication.js";

export const getAdminStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRiders = await User.countDocuments({ role: "rider" });
        const totalParcels = await Parcel.countDocuments();
        const pendingParcels = await Parcel.countDocuments({
            "shipment.status": "pending",
        });
        const deliveredParcels = await Parcel.countDocuments({
            "shipment.status": "delivered",
        });
        const unassignedPaidParcels = await Parcel.countDocuments({
            "pricing.paymentStatus": "paid",
            "shipment.riderId": null,
            "shipment.status": { $nin: ["delivered", "cancelled"] },
        });
        const pendingRiderApps = await RiderApplication.countDocuments({
            status: "pending",
        });

        const payments = await Payment.find().lean();
        const totalRevenue = payments.reduce(
            (acc, curr) => acc + (curr.amount || 0),
            0
        );

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalRiders,
                totalParcels,
                pendingParcels,
                deliveredParcels,
                unassignedPaidParcels,
                pendingRiderApps,
                totalRevenue,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllRiders = async (req, res, next) => {
    try {
        const riders = await User.find({
            role: "rider",
            status: "active",
        })
            .sort({ name: 1 })
            .select("_id name email phone photoURL")
            .lean();

        return res.status(200).json({
            success: true,
            count: riders.length,
            data: riders,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["user", "rider", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Allowed: 'user', 'rider', or 'admin'.",
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `User role updated to '${role}' successfully.`,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllParcels = async (req, res, next) => {
    try {
        const parcels = await Parcel.find()
            .populate("shipment.riderId", "name email phone")
            .sort({ createdAt: -1 })
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