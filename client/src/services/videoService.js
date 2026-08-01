import axios from 'axios'

const api = axios.create({
    baseURL: `${import.meta.env.VITE_WATCHTUBE_API}/videos`,
    withCredentials: true
})

const uploadVideo = async (video) => {

    const formData = new FormData();
    formData.append("title", video.title);
    formData.append("description", video.description);
    formData.append("isPublished", video.isPublished);
    formData.append("videoFile", video.videoFile);
    formData.append("thumbnail", video.thumbnail);

    const response = await api.post("/upload", formData);
    return response.data;
}

const getVideo = async (videoId) => {
    const response = await api.get(`/video/${videoId}`);
    return response.data;
}

const getChannelVideos = async (username) => {
    const response = await api.get(`/video/videos/${username}`);
    return response.data;
}

const getAllVideos = async() => {
    const response = await api.get("/all");
    return response.data;
}

export {
    uploadVideo,
    getVideo,
    getChannelVideos,
    getAllVideos,
}