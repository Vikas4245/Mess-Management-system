import mongoose, { Schema } from "mongoose";

const foodByteTransactionSchema = new mongoose.Schema(
  {
    rollno: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["reward", "deduction"], required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const FoodByteTransaction = mongoose.model(
  "FoodByteTransaction",
  foodByteTransactionSchema
);
