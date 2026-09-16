import { Router } from "express";

import {
    assignRiderToParcel,
    createParcel,
    getMyParcels,
    getParcelByTrackingId,
} from "../controllers/parcelController.js";

import authorizeRoles from "../middleware/authorizeRoles.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

router.post(
    "/",
    verifyFirebaseToken,
    authorizeRoles("user", "admin"),
    createParcel
);

router.get(
    "/my-parcels",
    verifyFirebaseToken,
    authorizeRoles("user"),
    getMyParcels
);

router.get(
    "/track/:trackingId",
    getParcelByTrackingId
);

router.patch(
    "/:parcelId/assign-rider",
    verifyFirebaseToken,
    authorizeRoles("admin"),
    assignRiderToParcel
);

export default router;