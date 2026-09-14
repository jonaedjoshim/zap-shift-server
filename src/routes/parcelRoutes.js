import { Router } from "express";

import {
    createParcel,
    getParcelByTrackingId,
} from "../controllers/parcelController.js";

import authorizeRoles from "../middleware/authorizeRoles.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

router.post(
    "/",
    verifyFirebaseToken,
    authorizeRoles(
        "user",
        "admin"
    ),
    createParcel
);

router.get(
    "/track/:trackingId",
    getParcelByTrackingId
);

export default router;