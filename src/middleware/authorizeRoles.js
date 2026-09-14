import User from "../models/User.js";

const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user?.uid) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Authentication required.",
                });
            }

            const user =
                await User.findOne({
                    firebaseUid:
                        req.user.uid,
                }).select(
                    "role status"
                );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message:
                        "User profile not found.",
                });
            }

            if (
                user.status !== "active"
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Your account is not active.",
                });
            }

            if (
                !allowedRoles.includes(
                    user.role
                )
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You do not have permission to perform this action.",
                });
            }

            req.appUser = {
                id: user._id,
                role: user.role,
                status: user.status,
            };

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default authorizeRoles;