import mongoose from "mongoose";
import QRCode from "qrcode";
import { generateMealTokenQR } from "../utils/generateQR.js";
import {Token} from "../models/token.model.js";
import {contract} from "../utils/MessAttendanceContract.js"
import { ethers } from "ethers"; 

const purchaseToken = async (req, res) => {
  try {
    const { name, amount, totalTokens } = req.body;

    if (!name || !amount || !totalTokens || totalTokens <= 0) {
        return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    const newToken = new Token({
        name,
        amount,
        totalTokens,
        remainingUses: totalTokens,
    });

    const savedToken = await newToken.save();

    const qrcode = await generateMealTokenQR(savedToken);

    savedToken.qrcode = qrcode;
    await savedToken.save(); 

    res.status(201).json({
        success: true,
        message: "Meal Token Purchased Successfully",
        tokenID: savedToken._id, 
        data: savedToken
    });

  } catch (error) {
      console.error("Error purchasing meal token:", error);
      res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Function to redeem a token
const redeemToken = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({ success: false, message: "Token ID is required" });
    }

    const token = await Token.findById(tokenId);

    if (!token) {
      return res.status(404).json({ success: false, message: "Token not found" });
    }

    if (token.remainingUses <= 0) {
      return res.status(400).json({ success: false, message: "Token has already been fully used" });
    }

    // Reduce the remaining uses
    token.remainingUses -= 1;
    await token.save();

    res.status(200).json({ 
      success: true, 
      message: "Token redeemed successfully", 
      remainingUses: token.remainingUses 
    });

  } catch (error) {
    console.error("Redeem Token Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export{
    purchaseToken,
    redeemToken,
}

