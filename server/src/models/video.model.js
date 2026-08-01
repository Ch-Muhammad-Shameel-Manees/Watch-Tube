import mongoose, {Schema} from "mongoose"

const videoSchema = new Schema({
    title:{
        type:String, 
        required: true,
        index:true
    },
    description: {
        type: String,
        required: true
    },
    videoFile: {
        type:String,
        required:true
    },
    thumbnail: {
        type:String
    },
    isPublished:{
        type:Boolean,
        default:false,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type: Number,
        required:true,
        default: 0
    },
    viewedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true}
)

const Video = mongoose.model("Video", videoSchema);

export default Video;