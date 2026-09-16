import { Router } from "express";
import { submitReview, getAllReviews } from "../controllers/reviewController.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = Router();

router.get("/public", getAllReviews);
router.post("/", verifyFirebaseToken, submitReview);

export default router;