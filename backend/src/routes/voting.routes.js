import { Router } from 'express';
import {
  initiateCommitteePoll,
  joinCandidate,
  startVotingPhase,
  completePoll,
  createGeneralPoll,
  vote,
  getVotedCandidate,
  getPollVoters,
  getVotedPolls,
  updateDurations,
  getTopCandidates,
  getCurrentCommitteeMembers,
  isCommitteeMember,
  getPoll,
  getPollCount,
  getPollStatus,
  getLivePolls,
  creditMonthlyToCommittee,
  deductFoodByte,
  getPollDetails,
  dropIfNoCandidates,
  handleLowCandidateCount
} from "../controllers/voting.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.post("/initiate-committee-poll", initiateCommitteePoll);
router.post("/join-candidate", joinCandidate);
router.post("/start-voting-phase", startVotingPhase);
router.post("/complete-poll", completePoll);
router.post("/create-general-poll", createGeneralPoll);
router.post("/vote", vote);

router.get("/get-voted-candidate/:pollId/:rollno", getVotedCandidate);
router.get("/get-poll-voters/:pollId", getPollVoters);
router.get("/voted-polls/:rollno", getVotedPolls);
router.post("/drop-if-no-candidates", dropIfNoCandidates);
router.post("/handle-low-candidate-count", handleLowCandidateCount);

router.post("/update-durations", updateDurations);

router.get("/get-top-candidates/:pollId", getTopCandidates);
router.get("/get-current-committee-members", getCurrentCommitteeMembers);
router.get("/is-committee-member/:rollno", isCommitteeMember);
router.get("/get-poll/:pollId", getPoll);
router.get("/get-poll-count", getPollCount);
router.get("/poll-status/:pollId", getPollStatus);
router.get("/get-live-polls", getLivePolls);

router.post("/credit-monthly-to-committee", creditMonthlyToCommittee);
router.post("/deduct-food-byte", deductFoodByte);


export default router

