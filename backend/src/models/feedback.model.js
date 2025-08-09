import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // References the Student collection/model
      required: true,
    },
    regarding: {
      type: String,
      enum: ["Food", "Staff", "Cleanliness", "Other"], // Matching the options from your form
      required: true,
    },
    feedback: {
      type: String,
      required: true, // Feedback comment is required as per the form
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
