import { Router } from "express";

import {
    applyForRider,
    getAllRiderApplications,
    getMyDeliveries,
    getMyRiderApplication,
    getRiderStats,
    updateDeliveryStatus,
    updateRiderApplicationStatus,
} from "../controllers/riderController.js";

import authorizeRoles from "../middleware/authorizeRoles.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

// User routes
router.post("/apply", verifyFirebaseToken, authorizeRoles("user"), applyForRider);
router.get("/my-application", verifyFirebaseToken, getMyRiderApplication);

// Rider routes
router.get("/my-deliveries", verifyFirebaseToken, authorizeRoles("rider"), getMyDeliveries);
router.get("/stats", verifyFirebaseToken, authorizeRoles("rider"), getRiderStats);
router.patch("/deliveries/:parcelId/status", verifyFirebaseToken, authorizeRoles("rider"), updateDeliveryStatus);

// Admin routes
router.get("/applications", verifyFirebaseToken, authorizeRoles("admin"), getAllRiderApplications);
router.patch("/applications/:id/status", verifyFirebaseToken, authorizeRoles("admin"), updateRiderApplicationStatus);

export default router;