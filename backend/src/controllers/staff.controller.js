import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Staff} from "../models/staff.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const staff = await Staff.findById(userId)
        const accessToken = staff.generateAccessToken()
        const refreshToken = staff.generateRefreshToken()

        staff.refreshToken = refreshToken
        await staff.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerStaff = asyncHandler( async (req, res) => {
    // get staff details from frontend
    // validation - not empty
    // check if staff already exists: staffid, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create staff object - create entry in db
    // remove password and refresh token field from response
    // check for staff creation
    // return res


    const {name, staffid, password } = req.body

    if (
        [name, staffid, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedStaff = await Staff.findOne({
        $or: [{ staffid }]
    })

    if (existedStaff) {
        throw new ApiError(409, "Staff with email or staffid already exists")
    }
   
    const staff = await Staff.create({
        name,
        staffid: staffid.toLowerCase(), 
        password,
    })

    const createdStaff = await Staff.findById(staff._id).select(
        "-password -refreshToken"
    )

    if (!createdStaff) {
        throw new ApiError(500, "Something went wrong while registering the staff")
    }

    return res.status(201).json(
        new ApiResponse(200, createdStaff, "Staff registered Successfully")
    )

} )

const loginStaff = asyncHandler(async (req, res) =>{
    // req body -> data
    // staffid or email
    //find the staff
    //password check
    //access and referesh token
    //send cookie

    const {staffid, password} = req.body
    console.log(staffid);

    if (!staffid) {
        throw new ApiError(400, "staffid is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(staffid || email)) {
    //     throw new ApiError(400, "staffid or email is required")
        
    // }

    const staff = await Staff.findOne({
        $or: [{staffid}]
    })

    if (!staff) {
        throw new ApiError(404, "Staff does not exist")
    }

    const isPasswordValid = await staff.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid staff credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(staff._id)

    const loggedInStudent = await Staff.findById(staff._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                staff: loggedInStudent, accessToken, refreshToken
            },
            "Staff logged In Successfully"
        )
    )

})

const logoutStaff = asyncHandler(async(req, res) => {
    await Staff.findByIdAndUpdate(
        req.staff._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Staff logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const staff = await User.findById(decodedToken?._id)
    
        if (!staff) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== staff?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(staff._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const staff = await User.findById(req.staff?._id)
    const isPasswordCorrect = await staff.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    staff.password = newPassword
    await staff.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentStaff = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.staff,
        "Staff fetched successfully"
    ))
})



export{
    registerStaff,
    loginStaff,
    logoutStaff,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentStaff
}