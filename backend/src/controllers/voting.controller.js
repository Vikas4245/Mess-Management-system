import { contract } from "../utils/VotingSystemContract.js";
import { ethers } from "ethers";
import { FoodByteTransaction } from "../models/foodbyteTransaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// 1. General Poll Creation
const createGeneralPoll = asyncHandler(async (req, res) => {
  const { title, options, duration } = req.body;

  const tx = await contract.createGeneralPoll(title, options, duration);
  await tx.wait();

  res.json(new ApiResponse(200, "General poll created"));
});

// 2. Initiate Committee Poll (admin grace period exceeded or admin calls)
const initiateCommitteePoll = asyncHandler(async (req, res) => {
  const { role } = req.body; // "admin" or "student"

  const now = new Date();
  const month = now.getMonth(); // 0 = Jan, 7 = Aug
  const day = now.getDate();

  if (month !== 0 && month !== 7) {
    throw new ApiError(400, "Committee poll can only be created in January or August");
  }

  if (day <= 15 && role !== "admin") {
    throw new ApiError(403, "Only admin can initiate poll in first 15 days");
  }

  const tx = await contract.initiateCommitteePoll();
  await tx.wait();
  res.json(new ApiResponse(200, "Committee poll initiated"));

});

// 3. Join as Candidate
const joinCandidate = asyncHandler(async (req, res) => {
  const { pollId, rollno } = req.body;

  const tx = await contract.joinCandidate(pollId, rollno);
  await tx.wait();

  await FoodByteTransaction.create({
    rollno,
    amount: 10,
    type: "reward",
    reason: "Candidate participation"
  });

  res.json(new ApiResponse(200, "Joined as candidate"));
});

// 4. Start Voting Phase (admin only)
const startVotingPhase = asyncHandler(async (req, res) => {
  const { pollId } = req.body;
  const tx = await contract.startVotingPhase(pollId);
  await tx.wait();
  res.json(new ApiResponse(200, "Poll voting started"));
});

// 5. Vote in Poll
const vote = asyncHandler(async (req, res) => {
  const { pollId, rollno, optionIndex } = req.body;
  const tx = await contract.vote(pollId, rollno, optionIndex);
  await tx.wait();

  await FoodByteTransaction.create({
    rollno,
    amount: 1,
    type: "reward",
    reason: "Poll vote"
  });

  res.json(new ApiResponse(200, "Vote submitted"));
});

// 6. Complete Poll (admin only)
const completePoll = asyncHandler(async (req, res) => {
  const { pollId } = req.body;
  const tx = await contract.completePoll(pollId);
  await tx.wait();
  res.json(new ApiResponse(200, "Poll completed"));
});

// 7. Get Voted Candidate by Poll and Student
const getVotedCandidate = asyncHandler(async (req, res) => {
  const { pollId, rollno } = req.params;
  const option = await contract.getVotedCandidate(pollId, rollno);
  res.json(new ApiResponse(200, option));
});

// 8. Get Voted Polls for a Student
const getVotedPolls = asyncHandler(async (req, res) => {
  const { rollno } = req.params;
  const total = Number(await contract.pollCount());
  const result = [];

  for (let i = 1; i <= total; i++) {
    try {
      const voted = await contract.getVotedCandidate(i, rollno);
      const poll = await contract.polls(i);
      result.push({
        pollId: i,
        title: poll.title,
        pollType: Number(poll.pollType),
        votedOption: voted
      });
    } catch (err) {
      // User hasn't voted in this poll — skip
    }
  }

  res.json(new ApiResponse(200, result));
});


// 9. Get Poll Voters
const getPollVoters = asyncHandler(async (req, res) => {
  const { pollId } = req.params;
  const voters = await contract.getPollVoters(pollId);
  res.json(new ApiResponse(200, voters));
});

// 10. Update Duration Settings
const updateDurations = asyncHandler(async (req, res) => {
  const { candidateJoinDuration, candidateJoinExtension, votingDuration } = req.body;

  const tx = await contract.updateDurations(
    candidateJoinDuration,
    candidateJoinExtension,
    votingDuration
  );
  await tx.wait();

  res.json(new ApiResponse(200, "Durations updated"));
});

// 11. Drop Poll if No Candidates
const dropIfNoCandidates = asyncHandler(async (req, res) => {
  const { pollId } = req.body;
  const tx = await contract.dropIfNoCandidates(pollId);
  await tx.wait();
  res.json(new ApiResponse(200, "Poll dropped if no candidates"));
});


// 12. Cron: Reward Monthly to Committee
const creditMonthlyToCommittee = asyncHandler(async (req, res) => {
  const members = await contract.getCommitteeMembers();

  for (const rollno of members) {
    await FoodByteTransaction.create({
      rollno,
      amount: 50,
      type: "reward",
      reason: "Monthly committee reward"
    });
  }

  res.json(new ApiResponse(200, "Monthly reward sent"));
});

// 13. Deduct FoodByteTransaction Penalty (non-participation)
const deductFoodByte = asyncHandler(async (req, res) => {
  const { rollno, reason } = req.body;

  await FoodByteTransaction.create({
    rollno,
    amount: -1,
    type: "penalty",
    reason
  });

  res.json(new ApiResponse(200, "Penalty deducted"));
});

// 14. Get Committee Members
const getCurrentCommitteeMembers = asyncHandler(async (req, res) => {
  const members = await contract.getCommitteeMembers();
  res.json(new ApiResponse(200, members));
});


// 15. Get Poll Details (optional)
const getPollDetails = asyncHandler(async (req, res) => {
  const { pollId } = req.params;
  const poll = await contract.polls(pollId);
  res.json(new ApiResponse(200, poll));
});

const handleLowCandidateCount = asyncHandler(async (req, res) => {
  const { pollId } = req.body;
  const tx = await contract.handleLowCandidateCount(pollId);
  await tx.wait();
  res.json(new ApiResponse(200, "Handled candidate count logic"));
});


const getTopCandidates = asyncHandler(async (req, res) => {
    const { pollId } = req.params;
    const topCandidates = await contract.getTopCandidates(pollId);
    res.json(new ApiResponse(200, topCandidates));
});

const isCommitteeMember = asyncHandler(async (req, res) => {
    const { rollno } = req.params;
    const status = await contract.isCommitteeMember(rollno);
    res.json(new ApiResponse(200, { rollno, isMember: status }));
});

const getPoll = asyncHandler(async (req, res) => {
    const { pollId } = req.params;
    const poll = await contract.polls(pollId);
    res.json(new ApiResponse(200, poll));
});

const getPollCount = asyncHandler(async (req, res) => {
    const count = await contract.pollCount();
    res.json(new ApiResponse(200, Number(count)));
});

const getPollStatus = asyncHandler(async (req, res) => {
    const pollId = req.params.pollId;
    const poll = await contract.polls(pollId);
    const now = Math.floor(Date.now() / 1000);

    let status = "Pending";
    if (poll.isCompleted) status = "Completed";
    else if (poll.isStarted && now < poll.endTime) status = "Live";
    else if (poll.isStarted && now >= poll.endTime) status = "Ended";
    else if (poll.isInitiated) status = "Candidate Enrollment";

    res.json({ success: true, status });
});


const getLivePolls = asyncHandler(async (req, res) => {
  const pollCount = Number(await contract.pollCount());
  const now = Math.floor(Date.now() / 1000);
  const livePolls = [];

  for (let i = 1; i <= pollCount; i++) {
    const poll = await contract.polls(i);
    if (poll.isStarted && now >= poll.startTime && now <= poll.endTime && !poll.isCompleted) {
      const data = {
        id: i,
        title: poll.title,
        pollType: Number(poll.pollType),
        startTime: Number(poll.startTime),
        endTime: Number(poll.endTime),
        candidates: [],
        options: [],
      };

      if (poll.pollType == 0) {
        data.candidates = await contract.getCandidates(i);
      } else {
        data.options = await contract.getOptions(i);
      }
      livePolls.push(data);
    }
  }
  res.json({ success: true, polls: livePolls });
}

);


export {
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
};
