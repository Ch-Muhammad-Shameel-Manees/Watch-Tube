import { apiError, asyncHandler } from "../utils/index.js";
import jwt from 'jsonwebtoken';


const verifyJWT = asyncHandler(async (req,res,next) => {
    const { accessToken } = req.cookies; 
    if (!accessToken) {
        throw new apiError(400, "Unauthorized Request")
    }

    const user = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!user) {
        throw new apiError(401, "False access token | Unauthorized request")
    }

    req.user = user;
    next();
})

export {
    verifyJWT
}