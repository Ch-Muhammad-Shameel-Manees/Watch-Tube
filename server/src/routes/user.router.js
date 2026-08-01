import { Router } from "express";
import { getChannelProfile, getCurrentUser, getWatchHistory, logout, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateCurrentPassword, updateUserDetails } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { deleteUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
);
router.route("/login").post(loginUser);

//Protected routes
router.route("/delete-account").get(verifyJWT, deleteUser);
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);
router.route("/logout").get(verifyJWT, logout);
router.route("/refresh-access-token").get(refreshAccessToken);
router.route("/update-details").post(verifyJWT, updateUserDetails);
router.route("/update-avatar").post(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/update-cover").post(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/update-password").post(verifyJWT, updateCurrentPassword);

router.route("/c/:username").get(getChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);


export default router;