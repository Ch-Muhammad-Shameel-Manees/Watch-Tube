import {apiError, apiResponse, asyncHandler, uploadToCloudinary} from "../utils/index.js";
import User from "../models/user.model.js";
import fs from 'fs';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async (id)=> {
    const user = await User.findById(id);
    if (!user) {
        throw new apiError(500, "Can't find user for generating tokens")
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    if (!(accessToken && refreshToken)) {
        throw new apiError(500, "Could not generate refresh and acccess Tokens")
    }

    user.refreshToken = refreshToken;
    await user.save();
    
    return {
        accessToken,
        refreshToken
    };
}

const registerUser = asyncHandler(async (req, res) => {

    const {fullName, username, email, password} = req.body;
    console.log("Username is:", username);

    if(
        [fullName, username, email, password].some((field) => field.trim() === '')
    ) {
        throw new apiError(400, 'All fields are required');
    }

    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    })

    if(existedUser) {
        throw new apiError(409, 'User with email or username already exists');
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath) {
        throw new apiError(400, 'Avatar is required');
    }

    let coverImageLocalPath = null;
    if(req.files && Array.isArray(req.files.coverImage) && req.files?.coverImage?.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new apiError(500, "Failed to upload avatar to cloudinary")
    }


    let coverImage = null;
    if (coverImageLocalPath) {
        coverImage = await uploadToCloudinary(coverImageLocalPath)
        if (!coverImage) {
            throw new apiError(500, "Failed to upload cover Image to cloudinary")
        }
    }

    const user = await User.create(
        {
            fullName,
            username,
            email,
            password,
            avatar: avatar?.url,
            coverImage: coverImage?.url
        }
    )

    const createdUser = await User.findById(user._id)
    .select("-password");

    if (!createdUser) {
        throw new apiError(500, 'Failed to create user');
    }

    res.status(201).json(
        new apiResponse(201, createdUser,'User registered successfully')
    );

})

const loginUser = asyncHandler(async (req,res) => {
    //Get username or email and password from user
    //Validate if these details arrived
    //Look for a user on the basis of username or email
    //If not found, throw an error
    //If found, check if the password is correct using the userSchema method
    //Create a function for generating access and refresh tokens
    //When generated, send the tokens to user through cookies
    //Also send the response of user's details and exclude unneccessary fields using select

    const {username, email, password} = req.body;

    if (!username && !email) {
        throw new apiError(400, "Username or email is required!");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    }).select("-watchHistory")
    if (!user) {
        throw new apiError(401, "User not found!")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new apiError(402, "The password you entered is not correct!")
    }


    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    if (!(accessToken && refreshToken)) {
        throw new apiError(500, "Could not generate access and refresh tokens")
    }

    const cookieOptions = {
        httpOnly: true,
        secure:true
    }

    res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new apiResponse(
        200, 
        user,
        "User has logged in successfully")
    )

})

const updateCurrentPassword = asyncHandler(async (req,res)=> {
    const user = await User.findById(req.user._id)
    .select("-refreshToken -watchHistory");
    if (!user) {
        throw new apiError(404, "Failed to fetch user from database")
    }

    const { currentPassword, newPassword } = req.body;
    if (!(currentPassword && newPassword)) {
        throw new apiError(400, "Both Current Password and new password are reuqired to update password")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
        throw new apiError(401, "Current Passowrd is not correct!")
    }

    user.password = newPassword;
    await user.save();

    res
    .status(200)
    .json(
        new apiResponse(200, user, "User Password updated successfully!")
    )
})

const refreshAccessToken = asyncHandler(async (req,res)=> {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new apiError(400, "Unauthorized request")
    }

    const user = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!user) {
        throw new apiError(400, "Could not verify refresh token")
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    const updatedUser = await User.findByIdAndUpdate(user._id,
        { refreshToken: newRefreshToken },
        { returnDocument: "after" }
    ).select("-password -watchHistory")

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
        new apiResponse(200, updatedUser, "Access token refreshsed successfully!")
    )
})

const deleteUser = asyncHandler(async (req,res)=> {
    
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new apiError(401, "User does not exist!")
    }

    await User.findByIdAndDelete(user._id);
    res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new apiResponse(200, null, "User account deleted successfully")
    )
})

const getCurrentUser = asyncHandler(async (req,res)=> {

    const user = await User.findById(req.user._id)
    .select("-password -refreshToken -watchHistory");
    if (!user) {
        throw new apiError(401, "User does not exist!")
    }

    res
    .status(200)
    .json(
        new apiResponse(200, user, "User fetched successfully!")
    )
})

const updateUserDetails = asyncHandler(async (req,res)=> {
    const { username, email, fullName } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.user._id,
        {
            username,
            email,
            fullName
        },
        { returnDocument: "after" }
    ).select("-password -refreshToken")
    if (!updatedUser) {
        throw new apiError(500, "Failed to update user details!")
    }

    res
    .status(200)
    .json(
        new apiResponse(200, updatedUser, "User details updated successfully")
    )
})

const updateAvatar = asyncHandler(async (req,res)=> {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar not uploaded!")
    }

    const user = await User.findById(req.user._id)
    .select("-password -refreshToken");
    if (!user) {
        throw new apiError(404, "User not found while uploading avatar")
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new apiError(500, "Failed uploading avatar to cloudinary")
    }

    user.avatar = avatar.url;
    await user.save();

    res
    .status(200)
    .json(
        new apiResponse(200, user, "Avatar updated successfully")
    )

})

const updateCoverImage = asyncHandler(async (req,res)=> {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new apiError(400, "Cover Image not uploaded!")
    }

    const user = await User.findById(req.user._id)
    .select("-password -refreshToken");
    if (!user) {
        throw new apiError(404, "User not found while uploading cover image")
    }

    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    if (!coverImage) {
        throw new apiError(500, "Failed uploading cover image to cloudinary")
    }

    user.coverImage = coverImage.url;
    await user.save();

    res
    .status(200)
    .json(
        new apiResponse(200, user, "Cover Image updated successfully")
    )

})

const logout = asyncHandler(async (req,res)=> {
    
    const user = await User.findByIdAndUpdate(req.user._id, 
        {
            refreshToken: ""
        },
        {returnDocument: "after"}
    ).select("-password");
    if (!user) {
        throw new apiError(404, "User does not exist!")
    }

    res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new apiResponse(200, user, "User logged out successfully")
    )
    
})

const getChannelProfile = asyncHandler(async (req,res)=> {
    const { username } = req.params;
    if (!username) {
        throw new apiError(400, "Username of channel is required!")
    }

    const { accessToken } = req.cookies;
    const loggedInUser = accessToken ? await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) : null;

    const user = await User.aggregate([
        {
            $match: {username}
        },
        {
            $lookup: {
                from: "subscriptions",
                foreignField: "channel",
                localField: "_id",
                as:"subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                foreignField: "subscriber",
                localField: "_id",
                as: "subscribed"
            }
        },
        {
            $addFields: {
                subscribers: {
                    $size: "$subscribers"
                },
                subscribed: {
                    $size: "$subscribed"
                },
                isSubscribed: loggedInUser ? {
                    $in: [new mongoose.Types.ObjectId(loggedInUser._id), "$subscribers.subscriber"]
                } : false
            }
        },
        {
            $project: {
                username: 1,
                email:1,
                fullName:1,
                avatar:1,
                coverImage:1,
                subscribers: "$subscribers",
                subscribed: "$subscribed",
                isSubscribed: "$isSubscribed"
            }
        }
    ])

    if (!user) {
        throw new apiError(500, "A channel with this id does not exist")
    }//Only this check is needed, the finding the user previosuly is not neccessary

    res
    .status(200)
    .json(
        new apiResponse(200, user[0], "User profile fetched successfully")
    )

    
})

const getWatchHistory = asyncHandler(async (req,res)=> {
    //User must be logged in, so get user from cookies
    //Get the user using their id
    //Apply aggregation pipeline to fetch video documents containing the IDs of watch history
    //Apply a sub-pipeline on the field received to get the owner
    //addFields and then project

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    if (!user) {
        throw new apiError(404, "Failed to find a user!")
    }

    res
    .status(200)
    .json(
        new apiResponse(200, user[0], "User Watch History fetched successfully")
    )

    
})

export {
    registerUser,
    loginUser,
    deleteUser,
    getCurrentUser,
    updateUserDetails,
    updateAvatar,
    updateCoverImage,
    getChannelProfile,
    logout,
    getWatchHistory,
    updateCurrentPassword,
    refreshAccessToken
}