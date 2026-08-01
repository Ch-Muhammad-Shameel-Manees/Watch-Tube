import { Router } from 'express';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import { toggleVideoLike, toggleCommentLike } from '../controllers/like.controller.js';

const router = Router();

router.route('/video/like/:videoId').post(
    verifyJWT,
    toggleVideoLike
);

router.route('/comment/like/:commentId').post(
    verifyJWT,
    toggleCommentLike
);

export default router;
