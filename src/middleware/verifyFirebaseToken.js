import { getAuth } from "firebase-admin/auth";

import firebaseAdminApp from "../config/firebaseAdmin.js";

const verifyFirebaseToken = async (
    req,
    res,
    next
) => {
    try {
        const authorization =
            req.headers.authorization;

        if (
            !authorization ||
            !authorization.startsWith(
                "Bearer "
            )
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required.",
            });
        }

        const token =
            authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication token missing.",
            });
        }

        const decodedToken =
            await getAuth(
                firebaseAdminApp
            ).verifyIdToken(token);

        req.user = {
            uid: decodedToken.uid,
            email:
                decodedToken.email ||
                null,
            name:
                decodedToken.name ||
                null,
        };

        next();
    } catch (error) {
        console.error(
            "Firebase token verification failed:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired authentication token.",
        });
    }
};

export default verifyFirebaseToken;