import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/").post(
    verifyJWT,
    createPlaylist
).get(
    verifyJWT,
    getUserPlaylists
);

router.route("/:playlistId").get(
    getPlaylistById
);

router.route("/:playlistId").put(
    verifyJWT,
    updatePlaylist
);

router.route("/:playlistId").delete(
    verifyJWT,
    deletePlaylist
);

router.route("/:playlistId/video/:videoId").post(
    verifyJWT,
    addVideoToPlaylist
).delete(
    verifyJWT,
    removeVideoFromPlaylist
);

export default router;
