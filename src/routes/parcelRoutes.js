import { Router } from "express";

import {
    createParcel,
    getParcelByTrackingId,
} from "../controllers/parcelController.js";

import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

router.post(
    "/",
    verifyFirebaseToken,
    createParcel
);

router.get(
    "/track/:trackingId",
    getParcelByTrackingId
);

export default router;