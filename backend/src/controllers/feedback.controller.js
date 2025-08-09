import mongoose from "mongoose"
import {Complaint} from "../models/complaint.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Feedback } from "../models/feedback.model.js";

const addFeedback = asyncHandler(async (req, res) => {
    const { provider, regarding, feedback } = req.body;

    try {
        if (!provider || !regarding || !feedback) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate if provider is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(provider)) {
            return res.status(400).json({ error: "Invalid provider ID" });
        }

        const newFeedback = new Feedback({ provider, regarding, feedback });
        await newFeedback.save();

        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ error: "Failed to submit feedback. Please try again." });
    }
})

const getAllFeedbacks = asyncHandler(async (req, res) => {
    try {
      const feedback = await Feedback.find().populate("provider", "name email"); // Populate student info if needed
      res.status(200).json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
})

const getFeedbacks = asyncHandler(async (req, res) => {
    const { provider } = req.params;
  
    try {
      const feedback = await Feedback.find({ provider }).populate("provider", "name email");
      if (!feedback.length) {
        return res.status(404).json({ message: "No feedback found for this student" });
      }
      res.status(200).json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
})

export {
    addFeedback, 
    getFeedbacks,
    getAllFeedbacks
}
