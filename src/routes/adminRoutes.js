import { Router } from "express";

import {
    getAdminStats,
    getAllParcels,
    getAllUsers,
    updateUserRole,
} from "../controllers/adminController.js";

import authorizeRoles from "../middleware/authorizeRoles.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

// All Admin routes require 'admin' role
router.use(verifyFirebaseToken, authorizeRoles("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.get("/parcels", getAllParcels);

export default router;