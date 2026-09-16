import { Router } from "express";

import {
    applyForRider,
    getAllRiderApplications,
    getMyRiderApplication,
    updateRiderApplicationStatus,
} from "../controllers/riderController.js";

import authorizeRoles from "../middleware/authorizeRoles.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

// User routes
router.post("/apply", verifyFirebaseToken, authorizeRoles("user"), applyForRider);
router.get("/my-application", verifyFirebaseToken, getMyRiderApplication);

// Admin routes
router.get("/applications", verifyFirebaseToken, authorizeRoles("admin"), getAllRiderApplications);
router.patch("/applications/:id/status", verifyFirebaseToken, authorizeRoles("admin"), updateRiderApplicationStatus);

export default router;