import mongoose from "mongoose";
import { Complaint } from "../models/complaint.model.js";
import { ApiError } from "../utils/ApiError.js";
import { rewardStudentWithFoodByte } from "../utils/rewardStudent.js";
import { Student } from "../models/student.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contract } from "../utils/ComplaintSystemContract.js";
import { getGeminiResponse } from "../utils/gemini.js"; 

const addComplaint = asyncHandler(async (req, res) => {
  const { category, description } = req.body;

  // Step 1: Fetch open complaints
  const complaints = await contract.getComplaintsByStatus("Open");

  const openComplaints = complaints.map((c) => ({
    id: Number(c.id),
    category: c.category,
    description: c.description,
  }));

  console.log("✅ Open Complaints:", openComplaints);

  // Step 2: Create Gemini prompt
  const prompt = `
You are helping a college mess complaint system identify if a new complaint is similar to any existing open complaints.

✔️ Similar means: both complaints are about the **same specific issue** (e.g. both about milk being spoiled).
❌ Not similar means: even if they are both about food, they refer to **different items or problems**.

⚠️ Important:
- Complaints may be in **English or Hindi**.
- Wording may differ, but meaning might be same.
- You must understand the **intent**.

---

🆕 New Complaint:
Category: ${category}
Description: ${description}

📋 Existing Open Complaints:
${openComplaints
  .map((c, i) => `${i + 1}. [${c.category}] ${c.description}`)
  .join("\n")}

---

❓If the new complaint is similar to any above, reply with the **number** (e.g., "1", "2", etc.) of the similar complaint.

❓If **none are similar**, reply with **"None"**.
`;

  // Step 3: Ask Gemini
  let geminiAnswer;
  try {
    geminiAnswer = (await getGeminiResponse(prompt)).trim().toLowerCase();
    console.log("🤖 Gemini Answer:", geminiAnswer);
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    throw new ApiError(500, "AI service is temporarily unavailable.");
  }

  // Step 4: Handle similar complaint by increasing count
  const matchIndex = parseInt(geminiAnswer);
  if (!isNaN(matchIndex) && matchIndex >= 1 && matchIndex <= openComplaints.length) {
    const matchedComplaint = openComplaints[matchIndex - 1];
    const tx = await contract.incrementComplaintCount(matchedComplaint.id);
    await tx.wait();
    return res
      .status(200)
      .json(
        new ApiResponse(200, { matchedId: matchedComplaint.id }, "Similar complaint exists. Count incremented.")
      );
  }

  // Step 5: Add new complaint
  const tx = await contract.addComplaint(category, description);
  await tx.wait();

  res.status(201).json(new ApiResponse(201, { tx }, "Complaint added successfully"));
});



// Get all complaints (for Admin View)
const getAllComplaints = asyncHandler(async (req, res) => {
    const complaints = await contract.getAllComplaints();

    const formatted = complaints.map(c => ({
        id: Number(c.id),
        category: c.category,
        description: c.description,
        count: Number(c.count),
        timestamp: Number(c.timestamp),
        status: c.status,
        voteDeadline: Number(c.voteDeadline),
        agreeVotes: Number(c.agreeVotes),
        disagreeVotes: Number(c.disagreeVotes),
        votingCompleted: c.votingCompleted
    }));

    res.json(formatted);
});

// Get complaint by ID
const getComplaint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const c = await contract.getComplaint(id);

    const formatted = {
        id: Number(c.id),
        category: c.category,
        description: c.description,
        count: Number(c.count),
        timestamp: Number(c.timestamp),
        status: c.status,
        voteDeadline: Number(c.voteDeadline),
        agreeVotes: Number(c.agreeVotes),
        disagreeVotes: Number(c.disagreeVotes),
        votingCompleted: c.votingCompleted
    };

    res.status(200).json(formatted);
});

// Get complaints by status
const getComplaintsByStatus = asyncHandler(async (req, res) => {
    const { status } = req.params;
    const complaints = await contract.getComplaintsByStatus(status);

    const formatted = complaints.map(c => ({
        id: Number(c.id),
        category: c.category,
        description: c.description,
        count: Number(c.count),
        timestamp: Number(c.timestamp),
        status: c.status,
        voteDeadline: Number(c.voteDeadline),
        agreeVotes: Number(c.agreeVotes),
        disagreeVotes: Number(c.disagreeVotes),
        votingCompleted: c.votingCompleted
    }));

    res.status(200).json(formatted);
});

// Get complaints by category
const getComplaintsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const complaints = await contract.getComplaintsByCategory(category);

    const formatted = complaints.map(c => ({
        id: Number(c.id),
        category: c.category,
        description: c.description,
        count: Number(c.count),
        timestamp: Number(c.timestamp),
        status: c.status,
        voteDeadline: Number(c.voteDeadline),
        agreeVotes: Number(c.agreeVotes),
        disagreeVotes: Number(c.disagreeVotes),
        votingCompleted: c.votingCompleted
    }));

    res.status(200).json(formatted);
});

// Get complaints by both status and category
const getComplaintsByStatusAndCategory = asyncHandler(async (req, res) => {
    const { status, category } = req.params;
    const complaints = await contract.getComplaintsByStatusAndCategory(status, category);

    const formatted = complaints.map(c => ({
        id: Number(c.id),
        category: c.category,
        description: c.description,
        count: Number(c.count),
        timestamp: Number(c.timestamp),
        status: c.status,
        voteDeadline: Number(c.voteDeadline),
        agreeVotes: Number(c.agreeVotes),
        disagreeVotes: Number(c.disagreeVotes),
        votingCompleted: c.votingCompleted
    }));

    res.status(200).json(formatted);
});

// Start voting on a complaint
const startVoting = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tx = await contract.startVoting(id);
    await tx.wait();
    res.json({ message: "Voting started successfully" });
});

// Vote on a complaint
const voteOnComplaint = asyncHandler(async (req, res) => {
    const { id, rollno, vote } = req.body;
    const tx = await contract.voteOnComplaint(id, rollno, vote);
    await tx.wait();

    // Reward student with 1 FoodByte (MongoDB reward)
    await rewardStudentWithFoodByte(rollno);

    res.json({ success: true, message: "Vote submitted and reward granted!" });
});

// Check if student voted
const hasStudentVoted = asyncHandler(async (req, res) => {
    const { id, rollno } = req.params;
    const hasVoted = await contract.hasStudentVoted(id, rollno);
    res.json({ hasVoted });
});

// Finalize voting
const finalizeVoting = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tx = await contract.finalizeVoting(id);
    await tx.wait();
    res.json({ success: true, message: "Voting finalized!" });
});

// Get vote counts
const getVoteCounts = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const [agreeVotes, disagreeVotes] = await contract.getVoteCounts(id);
    res.json({ agreeVotes, disagreeVotes });
});

// Resolve complaint
const resolveComplaint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tx = await contract.resolveComplaint(id);
    await tx.wait();
    res.status(201).json(new ApiResponse(201, { tx }, "Complaint resolved successfully"));
});

export {
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
};