import { Router } from "express";

import {
    getMyPayments,
    processPayment,
} from "../controllers/paymentController.js";

import authorizeRoles from "../middleware/authorizeRoles.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

router.post(
    "/process",
    verifyFirebaseToken,
    authorizeRoles("user"),
    processPayment
);

router.get(
    "/my-payments",
    verifyFirebaseToken,
    authorizeRoles("user"),
    getMyPayments
);

export default router;