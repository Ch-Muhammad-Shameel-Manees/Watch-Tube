import { asyncHandler, apiError, apiResponse } from "../utils/index.js";
import { Comment } from "../models/comment.model.js";
import Video from "../models/video.model.js";

const createComment = asyncHandler(async (req, res) => {
    const { videoId, commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new apiError(400, "Comment content is required!")
    }

    let video = null;
    let parentComment = null;

    if (commentId) {
        parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            throw new apiError(404, "Parent comment not found!")
        }

        video = await Video.findById(parentComment.video);
        if (!video) {
            throw new apiError(404, "Video for parent comment not found!")
        }
    } else {
        if (!videoId) {
            throw new apiError(400, "Video Id is required!")
        }

        video = await Video.findById(videoId);
        if (!video) {
            throw new apiError(404, "Video not found!")
        }
    }

    const comment = await Comment.create({
        content,
        owner: req.user._id,
        video: video._id,
        parentComment: parentComment?._id
    });

    res
        .status(201)
        .json(
            new apiResponse(201, comment, "Comment created successfully")
        )
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new apiError(400, "Comment Id is required!")
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apiError(404, "Comment not found!")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized request!")
    }

    await Comment.deleteOne({ _id: comment._id });

    res
        .status(200)
        .json(
            new apiResponse(200, comment, "Comment deleted successfully")
        )
});

export {
    createComment,
    deleteComment
};
