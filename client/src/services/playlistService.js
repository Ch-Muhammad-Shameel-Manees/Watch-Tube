import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_WATCHTUBE_API}/playlists`,
    withCredentials: true
})

const createPlaylist = async (playlist) => {
    const response = await api.post("", playlist);
    return response.data;
}

const deletePlaylist = async (playlist_id) => {
    const response = await api.delete(`/playlists/${playlist_id}`);
    return response.data;
}

const getUserPlaylists = async () => {
    const response = await api.get("");
    return response.data;
}

const getPlaylistById = async (playlist_id) => {
    const response = await api.get(`/${playlist_id}`);
    return response.data;
}

const addVideoToPlaylist = async (playlist_id, video_id) => {
    const response = await api.post(`/${playlist_id}/video/${video_id}`);
    return response.data;
}

const removeVideoFromPlaylist = async (playlist_id, video_id) => {
    const response = await api.delete(`/${playlist_id}/video/${video_id}`);
    return response.data;
}

export {
    createPlaylist,
    deletePlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
}