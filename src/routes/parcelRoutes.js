import { Router } from "express";

import {
    createParcel,
    getParcelByTrackingId,
} from "../controllers/parcelController.js";

const router = Router();

router.post("/", createParcel);

router.get(
    "/track/:trackingId",
    getParcelByTrackingId
);

export default router;