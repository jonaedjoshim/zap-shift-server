import { Router } from "express";

import authorizeRoles from "../middleware/authorizeRoles.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

router.get(
    "/check",
    verifyFirebaseToken,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message:
                "Admin access granted.",
            user: req.appUser,
        });
    }
);

export default router;