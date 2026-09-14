import User from "../models/User.js";

export const syncUser = async (
    req,
    res,
    next
) => {
    try {
        const {
            uid,
            email,
            name,
        } = req.user;

        if (!uid || !email) {
            return res.status(400).json({
                success: false,
                message:
                    "Authenticated user information is incomplete.",
            });
        }

        const clientProfile =
            req.body || {};

        let user = await User.findOne({
            firebaseUid: uid,
        });

        if (!user) {
            user = await User.create({
                firebaseUid: uid,

                name:
                    clientProfile.name ||
                    name ||
                    email.split("@")[0],

                email,

                photoURL:
                    clientProfile.photoURL ||
                    null,

                role: "user",
                status: "active",
                lastLoginAt:
                    new Date(),
            });

            return res
                .status(201)
                .json({
                    success: true,
                    message:
                        "User profile created.",

                    data: user,
                });
        }

        if (
            clientProfile.name &&
            clientProfile.name !==
            user.name
        ) {
            user.name =
                clientProfile.name;
        }

        if (
            clientProfile.photoURL !==
            undefined
        ) {
            user.photoURL =
                clientProfile.photoURL ||
                null;
        }

        user.lastLoginAt =
            new Date();

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "User profile synchronized.",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyProfile = async (
    req,
    res,
    next
) => {
    try {
        const user =
            await User.findOne({
                firebaseUid:
                    req.user.uid,
            }).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "User profile not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};