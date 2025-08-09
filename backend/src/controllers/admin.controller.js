import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Admin} from "../models/admin.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const admin = await Admin.findById(userId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerAdmin = asyncHandler( async (req, res) => {
    // get admin details from frontend
    // validation - not empty
    // check if admin already exists: adminkey, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create admin object - create entry in db
    // remove password and refresh token field from response
    // check for admin creation
    // return res


    const {name, adminkey, password } = req.body

    if (
        [name, adminkey, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedAdmin = await Admin.findOne({
        $or: [{ adminkey }]
    })

    if (existedAdmin) {
        throw new ApiError(409, "Admin with adminkey already exists")
    }
   
    const admin = await Admin.create({
        name,
        adminkey: adminkey.toLowerCase(), 
        password,
    })

    const createdAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin")
    }

    return res.status(201).json(
        new ApiResponse(200, createdAdmin, "Admin registered Successfully")
    )

} )

const loginAdmin = asyncHandler(async (req, res) =>{
    // req body -> data
    // adminkey or email
    //find the admin
    //password check
    //access and referesh token
    //send cookie

    const {adminkey, password} = req.body
    console.log(adminkey);

    if (!adminkey) {
        throw new ApiError(400, "adminkey is required")
    }

    const admin = await Admin.findOne({
        $or: [{adminkey}]
    })

    if (!admin) {
        throw new ApiError(404, "Admin does not exist")
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

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
                admin: loggedInAdmin, accessToken, refreshToken
            },
            "Admin logged In Successfully"
        )
    )

})

const logoutAdmin = asyncHandler(async(req, res) => {
    await Admin.findByIdAndUpdate(
        req.admin._id,
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
    .json(new ApiResponse(200, {}, "Admin logged Out"))
})

// const refreshAccessToken = asyncHandler(async (req, res) => {
//     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

//     if (!incomingRefreshToken) {
//         throw new ApiError(401, "unauthorized request")
//     }

//     try {
//         const decodedToken = jwt.verify(
//             incomingRefreshToken,
//             process.env.REFRESH_TOKEN_SECRET
//         )
    
//         const admin = await User.findById(decodedToken?._id)
    
//         if (!admin) {
//             throw new ApiError(401, "Invalid refresh token")
//         }
    
//         if (incomingRefreshToken !== admin?.refreshToken) {
//             throw new ApiError(401, "Refresh token is expired or used")
            
//         }
    
//         const options = {
//             httpOnly: true,
//             secure: true
//         }
    
//         const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(admin._id)
    
//         return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", newRefreshToken, options)
//         .json(
//             new ApiResponse(
//                 200, 
//                 {accessToken, refreshToken: newRefreshToken},
//                 "Access token refreshed"
//             )
//         )
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid refresh token")
//     }

// })

// const changeCurrentPassword = asyncHandler(async(req, res) => {
//     const {oldPassword, newPassword} = req.body

    

//     const admin = await User.findById(req.admin?._id)
//     const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword)

//     if (!isPasswordCorrect) {
//         throw new ApiError(400, "Invalid old password")
//     }

//     admin.password = newPassword
//     await admin.save({validateBeforeSave: false})

//     return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Password changed successfully"))
// })


// const getCurrentStaff = asyncHandler(async(req, res) => {
//     return res
//     .status(200)
//     .json(new ApiResponse(
//         200,
//         req.admin,
//         "Admin fetched successfully"
//     ))
// })



export{
    loginAdmin,
    logoutAdmin,
    registerAdmin,
    // refreshAccessToken,
    // changeCurrentPassword,
    // getCurrentStaff
}