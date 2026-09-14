import Parcel from "../models/Parcel.js";

import calculateParcelCost from "../utils/calculateParcelCost.js";
import generateTrackingId from "../utils/generateTrackingId.js";

export const createParcel = async (
    req,
    res,
    next
) => {
    try {
        const data = req.body;

        const cost =
            calculateParcelCost({
                parcelType:
                    data.parcelType,

                weight:
                    data.parcelWeight,

                senderRegion:
                    data.senderRegion,

                receiverRegion:
                    data.receiverRegion,
            });

        if (cost === null) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid parcel information for pricing.",
            });
        }

        if (!req.user?.email) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user email is required.",
            });
        }

        const trackingId =
            generateTrackingId();

        const parcel =
            await Parcel.create({
                ...data,

                trackingId,

                cost,

                parcelWeight:
                    data.parcelType ===
                        "document"
                        ? null
                        : Number(
                            data.parcelWeight
                        ),

                createdBy:
                    req.user.email,

                paymentStatus:
                    "unpaid",

                deliveryStatus:
                    "pending",

                trackingHistory: [
                    {
                        status:
                            "pending",

                        message:
                            "Parcel booking created.",
                    },
                ],
            });

        return res.status(201).json({
            success: true,
            message:
                "Parcel created successfully.",
            data: parcel,
        });
    } catch (error) {
        next(error);
    }
};

export const getParcelByTrackingId =
    async (req, res, next) => {
        try {
            const { trackingId } =
                req.params;

            const parcel =
                await Parcel.findOne({
                    trackingId,
                }).lean();

            if (!parcel) {
                return res
                    .status(404)
                    .json({
                        success: false,
                        message:
                            "Parcel not found.",
                    });
            }

            return res.status(200).json({
                success: true,
                data: parcel,
            });
        } catch (error) {
            next(error);
        }
    };