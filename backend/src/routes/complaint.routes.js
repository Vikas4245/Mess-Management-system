import { Router } from 'express';
import {
    addComplaint,
    getAllComplaints,
    resolveComplaint,
    getComplaint,
    startVoting,
    voteOnComplaint,
    getVoteCounts,
    finalizeVoting,
    hasStudentVoted,
    getComplaintsByStatus,
    getComplaintsByCategory,
    getComplaintsByStatusAndCategory
} from "../controllers/complaint.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/add-complaint").post(addComplaint);
router.route("/complaints").get(getAllComplaints);
router.route("/resolve-complaint/:id").put(resolveComplaint);
router.route("/get-complaint/:id").get(getComplaint);
router.route("/start-voting/:id").post(startVoting);
router.route("/vote").post(voteOnComplaint);
router.route("/get-vote-counts/:id").get(getVoteCounts);
router.route("/finalize-voting/:id").post(finalizeVoting);
router.route("/has-student-voted/:id/:rollno").get(hasStudentVoted);
router.route("/complaints/status/:status").get(getComplaintsByStatus);
router.route("/complaints/category/:category").get(getComplaintsByCategory);
router.route("/complaints/status/:status/category/:category").get(getComplaintsByStatusAndCategory);


export default router