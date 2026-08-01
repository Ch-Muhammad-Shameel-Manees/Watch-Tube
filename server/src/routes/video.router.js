import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { deleteVideo, getVideo, getVideosByUser, uploadVideo, updateVideoDetails, updateVideoThumbnail, getAllVideos } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/upload").post(
    verifyJWT,
    upload.fields([
        {
            name:"videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
     ]),
    uploadVideo
);
router.route("/video/:videoId")
    .get(getVideo)
    .put(verifyJWT, updateVideoDetails); //Would run different handlers on the same route depending on http method
router.route("/video/:videoId/thumbnail").post(
    verifyJWT,
    upload.single("thumbnail"),
    updateVideoThumbnail
);
router.route("/video/videos/:username").get(getVideosByUser);
router.route("/all").get(getAllVideos);
router.route("/video/d/:videoId").get(verifyJWT, deleteVideo);


export default router;
