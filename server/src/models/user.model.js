import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Playlist from "./playlist.model.js";

const userSchema = new Schema(
    {
        username: {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        fullName: {
            type:String,
        },
        avatar:{
            type:String,
            required:true
        },
        coverImage: {
            type:String,
        },
        password: {
            type:String,
            required:[true, "Password is required"]
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        refreshToken: {
            type: String
        }
    }, {timestamps: true}
)

userSchema.pre("save", async function() {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.post("save", async function (doc) {
  try {
    if (doc.isNew) {
      await Playlist.create({
        name: "Watch Later",
        owner: doc._id,
      });
    }
  } catch (error) {
    console.log("Error in creating a playlist for user:", error)
  }
});

// userSchema.pre("save", async function(next) {
//     if(!this.isModified("password")) return next(); 

//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// })
//With async functions, mongoose do not pass next() in function. And it resolves promise 
//chain automatically and you don't have to manually write next().

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema);

export default User;

