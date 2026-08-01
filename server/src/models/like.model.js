import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: false
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: false
    }
}, { timestamps: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;
