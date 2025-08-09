import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {contract} from "../utils/MessAttendanceContract.js"
import { ethers } from "ethers"; 

const recordAttendance = async (req, res) => {
    const { rollNo, session, date } = req.body;

    try {
        // Ensure date is in a string format (e.g., "2025-02-15")
        if (!rollNo || !session || !date) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const dateHash = ethers.id(date);

        const tx = await contract.recordAttendance(rollNo, session, dateHash);
        await tx.wait(); // Wait for transaction confirmation
        res.status(201).json(
            new ApiResponse(201, { tx, txHash: tx.hash }, "Attendance recorded successfully")
        );
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const getAttendance = async (req, res) => {
    const { date } = req.params; // Expect a readable date (e.g., "2025-02-15")

    try {
        if (!date) {
            return res.status(400).json({ success: false, error: "Date is required" });
        }

        const dateHash = ethers.id(date);

        // Fetch meal attendance from the contract
        const mealAttendance = await contract.getMealAttendance(dateHash);

        res.status(200).json({
            success: true,
            attendance: {
                morning: mealAttendance.morningCount.toString(),
                afternoon: mealAttendance.afternoonCount.toString(),
                evening: mealAttendance.eveningCount.toString(),
            },
            message: "Attendance retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export {
    recordAttendance,
    getAttendance,
}
