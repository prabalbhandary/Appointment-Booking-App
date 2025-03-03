import express from 'express'
import {authenticateToken, restrict} from "../middleware/authenticateToken.js";
import {getAllReviews, createReview} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", authenticateToken, getAllReviews);
router.post("/", authenticateToken, restrict(["patient"]), createReview);

export default router