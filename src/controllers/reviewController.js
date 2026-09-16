import Review from "../models/Review.js";
import Parcel from "../models/Parcel.js";
import User from "../models/User.js";

// User submits a review for a delivered parcel
export const submitReview = async (req, res, next) => {
    try {
        const { parcelId, rating, feedback } = req.body;

        if (!parcelId || !rating || !feedback) {
            return res.status(400).json({
                success: false,
                message: "Parcel ID, rating (1-5), and feedback are required.",
            });
        }

        const numericRating = Number(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be a number between 1 and 5.",
            });
        }

        const parcel = await Parcel.findById(parcelId);
        if (!parcel) {
            return res.status(404).json({ success: false, message: "Parcel not found." });
        }

        if (parcel.shipment?.status !== "delivered") {
            return res.status(400).json({ success: false, message: "Only delivered parcels can be reviewed." });
        }

        const currentUser = await User.findOne({ firebaseUid: req.user.uid });

        const existingReview = await Review.findOne({
            parcelId,
            userId: currentUser ? currentUser._id : req.user.uid,
        });

        if (existingReview) {
            return res.status(400).json({ success: false, message: "You have already submitted a review for this parcel." });
        }

        const review = await Review.create({
            userId: currentUser ? currentUser._id : req.user.uid,
            parcelId,
            userName: currentUser?.name || req.user?.name || "Customer",
            userPhoto: currentUser?.photoURL || null,
            rating: numericRating,
            feedback: feedback.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            data: review,
        });
    } catch (error) {
        next(error);
    }
};

// Get all reviews (for public display on homepage)
export const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }).limit(10).lean();
        return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        next(error);
    }
};