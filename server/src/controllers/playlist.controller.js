import { asyncHandler, apiError, apiResponse } from "../utils/index.js";
import Playlist from "../models/playlist.model.js";
import Video from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
        throw new apiError(400, "Playlist name is required!")
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description?.trim() || "",
        owner: req.user._id,
        videos: []
    });

    res
        .status(201)
        .json(
            new apiResponse(201, playlist, "Playlist created successfully")
        )
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId  = req.user._id;

    if (!userId) {
        throw new apiError(400, "User Id is required!")
    }

    const playlists = await Playlist.find({ owner: userId }).populate({
        path: "videos",
        select: "title thumbnail duration"
    });

    res
        .status(200)
        .json(
            new apiResponse(200, playlists, "User playlists fetched successfully")
        )
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new apiError(400, "Playlist Id is required!")
    }

    const playlist = await Playlist.findById(playlistId).populate({
        path: "videos",
        select: "title description thumbnail duration views owner createdAt updatedAt",
        populate: {
        path: "owner",
        select: "username avatar"
    }

    })
    
    if (!playlist) {
        throw new apiError(404, "Playlist not found!")
    }

    res
        .status(200)
        .json(
            new apiResponse(200, playlist, "Playlist fetched successfully")
        )
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new apiError(400, "Playlist Id and Video Id are required!")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found!")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized request!")
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new apiError(404, "Video not found!")
    }

    if (playlist.videos.some((id) => id.toString() === video._id.toString())) {
        return res
            .status(200)
            .json(
                new apiResponse(200, playlist, "Video already exists in playlist")
            )
    }

    playlist.videos.push(video._id);
    await playlist.save();

    res
        .status(200)
        .json(
            new apiResponse(200, playlist, "Video added to playlist successfully")
        )
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new apiError(400, "Playlist Id and Video Id are required!")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found!")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized request!")
    }

    const videoIndex = playlist.videos.findIndex(
        (id) => id.toString() === videoId.toString()
    );

    if (videoIndex === -1) {
        throw new apiError(404, "Video not found in playlist!")
    }

    playlist.videos.splice(videoIndex, 1);
    await playlist.save();

    res
        .status(200)
        .json(
            new apiResponse(200, playlist, "Video removed from playlist successfully")
        )
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new apiError(400, "Playlist Id is required!")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found!")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized request!")
    }

    await Playlist.deleteOne({ _id: playlist._id });

    res
        .status(200)
        .json(
            new apiResponse(200, playlist, "Playlist deleted successfully")
        )
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId) {
        throw new apiError(400, "Playlist Id is required!")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found!")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized request!")
    }

    if (typeof name !== "undefined") {
        playlist.name = name.trim();
    }

    if (typeof description !== "undefined") {
        playlist.description = description.trim();
    }

    await playlist.save();

    res
        .status(200)
        .json(
            new apiResponse(200, playlist, "Playlist updated successfully")
        )
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};
