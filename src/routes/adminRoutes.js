import { Router } from "express";

import {
    getAdminStats,
    getAllParcels,
    getAllRiders,
    getAllUsers,
    updateUserRole,
} from "../controllers/adminController.js";

import authorizeRoles from "../middleware/authorizeRoles.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

router.use(verifyFirebaseToken, authorizeRoles("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/riders", getAllRiders);
router.patch("/users/:id/role", updateUserRole);
router.get("/parcels", getAllParcels);

export default router;