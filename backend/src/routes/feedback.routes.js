import { Router } from 'express';
import {
    addFeedback, 
    getFeedbacks,
    getAllFeedbacks
} from "../controllers/feedback.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/add-feedback").post(addFeedback)
router.route("/feedbacks").get(getAllFeedbacks)
router.route("/get-feedback/:id").get(getFeedbacks)

export default router