import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { createComment, deleteComment } from "../controllers/comment.controller.js";

const router = Router();

router.route("/video/:videoId/comment").post(
    verifyJWT,
    createComment
);

router.route("/comment/:commentId/comment").post(
    verifyJWT,
    createComment
);

router.route("/comment/:commentId").delete(
    verifyJWT,
    deleteComment
);

export default router;
