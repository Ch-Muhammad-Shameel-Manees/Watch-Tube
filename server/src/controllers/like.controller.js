import { asyncHandler, apiError, apiResponse } from '../utils/index.js';
import Video from '../models/video.model.js';
import { Comment } from '../models/comment.model.js';
import Like from '../models/like.model.js';

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new apiError(400, "Video Id is required!")
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found!")
    }

    const existingLike = await Like.findOne({
        owner: req.user._id,
        video: video._id
    });

    if (existingLike) {
        await existingLike.deleteOne();

        return res
            .status(200)
            .json(
                new apiResponse(200, { isLiked: false }, "Video like removed")
            )
    }

    await Like.create({
        owner: req.user._id,
        video: video._id
    });

    res
        .status(200)
        .json(
            new apiResponse(200, { isLiked: true }, "Video liked successfully")
        )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new apiError(400, "Comment Id is required!")
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apiError(404, "Comment not found!")
    }

    const existingLike = await Like.findOne({
        owner: req.user._id,
        comment: comment._id
    });

    if (existingLike) {
        await existingLike.deleteOne();

        return res
            .status(200)
            .json(
                new apiResponse(200, { isLiked: false }, "Comment like removed")
            )
    }

    await Like.create({
        owner: req.user._id,
        comment: comment._id
    });

    res
        .status(200)
        .json(
            new apiResponse(200, { isLiked: true }, "Comment liked successfully")
        )
})

export {
    toggleVideoLike,
    toggleCommentLike
}
