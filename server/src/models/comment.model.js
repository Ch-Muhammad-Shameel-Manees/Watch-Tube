import mongoose, {Schema} from "mongoose"

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    }
}, {timestamps: true}
)

const Comment = mongoose.model("Comment", commentSchema);

export {
    Comment
}