import { asyncHandler, apiError, apiResponse, uploadToCloudinary } from '../utils/index.js';
import Video from "../models/video.model.js";
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const uploadVideo = asyncHandler(async (req,res)=> {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new apiError(404, "Failed to found user!")
    }

    const { title, description, isPublished } = req.body;
    if ([title, description, isPublished].some((field)=> field.trim() == '')) {
        throw new apiError(400, "All fields are required!")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!(videoFileLocalPath && thumbnailLocalPath)) {
        throw new apiError(400, "Video and thumbnail are required")
    }

    const videoFile = await uploadToCloudinary(videoFileLocalPath);
    if (!videoFile) {
        throw new apiError(500, "Failed uploading video file to cloudinary")
    }
    const duration = videoFile.duration;

    const thumbnail = await uploadToCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
        throw new apiError(500, "Failed uploading thumbnail to cloudinary")
    }

    const video = await Video.create({
        title,
        description,
        isPublished,
        videoFile: videoFile?.secure_url,
        thumbnail: thumbnail?.url,
        duration,
        views: 0,
        owner: user?._id
    })

    res
    .status(200)
    .json(
        new apiResponse(200, video, "Video uploaded successfully")
    )
})

const getVideosByUser = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username) {
        throw new apiError(400, "User id is required!")
    }

    const user = await User.find({
        username
    }).select("_id username fullName avatar");
    if (!user) {
        throw new apiError(404, "User not found!")
    }

    console.log("User is:", user);

    const videos = await Video
    .find({ owner: user[0]._id })
    .sort({ createdAt: -1 })
    .populate({
        path: "owner",
        select: "username avatar"
    });

    res
    .status(200)
    .json(
        new apiResponse(200, videos, "User videos fetched successfully")
    )
})

const getVideo = asyncHandler(async (req,res)=> {
    const { videoId } = req.params;
    if (!videoId) {
        throw new apiError(400, "Video Id is required!")
    }

    let currentUserId = null;
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
        try {
            const decodedUser = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            currentUserId = decodedUser?._id;
        } catch (err) {
            // Ignore invalid or expired token; still return video data without counting the view
        }
    }

    const currentUserObjectId = currentUserId ? new mongoose.Types.ObjectId(currentUserId) : null;

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "owner",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            email: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$ownerDetails"
                }
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                let: {
                    ownerId: "$owner._id",
                    currentUserId: { $literal: currentUserObjectId }
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$subscriber", "$$currentUserId"] },
                                    { $eq: ["$channel", "$$ownerId"] }
                                ]
                            }
                        }
                    },
                    {
                        $limit: 1
                    }
                ],
                as: "subscriptionStatus"
            }
        },
        {
            $addFields: {
                isSubscribed: {
                    $gt: [{ $size: "$subscriptionStatus" }, 0]
                }
            }
        },
        {
            $lookup: {
                from: "comments",
                foreignField: "video",
                localField: "_id",
                as: "comments",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            foreignField: "_id",
                            localField: "owner",
                            as: "ownerDetails",
                            pipeline: [                                
                                {
                                    $project: {
                                        username: 1,
                                        email: 1,
                                        avatar: 1,
                                        fullName: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            ownerDetails: {
                                $first: "$ownerDetails"
                            }
                        }
                    }                    
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                foreignField: "video",
                localField: "_id",
                as: "likes",
                pipeline: [
                    {
                        $project: {
                            owner: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                likedBy: {
                    $map: {
                        input: "$likes",
                        as: "like",
                        in: "$$like.owner"
                    }
                }
            }
        }
    ])

    if (!video[0]) {
        throw new apiError(404, "Video with the given id does not exist")
    }

    const videoData = video[0];
    if (videoData.isPublished === false) {
        throw new apiError(400, "This is a private video")
    }

    if (currentUserId) {
        const updatedVideo = await Video.findOneAndUpdate(
            {
                _id: videoId,
                viewedBy: { $ne: new mongoose.Types.ObjectId(currentUserId) }
            },
            {
                $inc: { views: 1 },
                $addToSet: { viewedBy: new mongoose.Types.ObjectId(currentUserId) }
            },
            { new: true }
        );

        if(video) {
            const updatedWatchHistory = await User.findByIdAndUpdate(
            currentUserId,
            {
                $push: {
                    watchHistory: videoData?._id
                }
            }
            )
            if (updatedWatchHistory) {
            console.log("Updated Watch History")
        }
        }

        if (updatedVideo) {
            videoData.views = updatedVideo.views;
        }
    }
   
    res
    .status(200)
    .json(
        new apiResponse(200, videoData, "Video fetched successfully")
    )
})

const deleteVideo = asyncHandler(async (req,res)=> {
    const { videoId } = req.params;
    if (!videoId) {
        throw new apiError(400, "Video Id is required for deleting video!")
    }

    const video = await Video.findById(videoId)
    .select("-duration -views -isPublished");
    if (!video) {
        throw new apiError(404, "Video not found!")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized request!")
    }

    await Video.deleteOne({
        _id: video._id
    })

    res
    .status(200)
    .json(
        new apiResponse(200, video, "Video deleted successfully")
    )
})

const updateVideoDetails = asyncHandler(async (req,res)=> {
    const { videoId } = req.params;
    if (!videoId) {
        throw new apiError(400, "Video Id is required for updating video")
    }

    const { title, description, isPublished } = req.body;
    const updatePayload = {}

    if (typeof title !== 'undefined') updatePayload.title = title
    if (typeof description !== 'undefined') updatePayload.description = description
    if (typeof isPublished !== 'undefined') {
        updatePayload.isPublished = String(isPublished).toLowerCase() === 'true'
    }

    if (Object.keys(updatePayload).length === 0) {
        throw new apiError(400, "At least one field is required to update")
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found!")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized request!")
    }

    Object.assign(video, updatePayload)
    await video.save()

    res
    .status(200)
    .json(
        new apiResponse(200, video, "Video updated successfully")
    )
})

const updateVideoThumbnail = asyncHandler(async (req,res)=> {
    const { videoId } = req.params;
    if (!videoId) {
        throw new apiError(400, "Video Id is required for updating thumbnail")
    }

    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
        throw new apiError(400, "Thumbnail file is required")
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found!")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized request!")
    }

    const thumbnail = await uploadToCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
        throw new apiError(500, "Failed uploading thumbnail to cloudinary")
    }

    video.thumbnail = thumbnail.url;
    await video.save();

    res
    .status(200)
    .json(
        new apiResponse(200, video, "Video thumbnail updated successfully")
    )
})

const getAllVideos = asyncHandler(async (req,res)=> {
    const videos = await Video.find({})
    .populate(
        {
        path: "owner",
        select: "username avatar"
        },
    );

    if (!videos) {
        throw  new apiError(500, "Failed to retrieve videos!")
    }

    res
    .status(200)
    .json(
        new apiResponse(200, videos, "All videos retrieved successfully!")
    )
})

export {
    uploadVideo,
    getVideo,
    getVideosByUser,
    deleteVideo,
    updateVideoDetails,
    updateVideoThumbnail,
    getAllVideos
}