import { Router } from "express";

import {
    getMyProfile,
    syncUser,
} from "../controllers/userController.js";

import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

router.post(
    "/sync",
    verifyFirebaseToken,
    syncUser
);

router.get(
    "/me",
    verifyFirebaseToken,
    getMyProfile
);

export default router;