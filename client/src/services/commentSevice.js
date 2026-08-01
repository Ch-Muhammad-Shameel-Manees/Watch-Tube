import axios from "axios";
import { apiBaseUrl } from "../utils/constants.js";

const api = axios.create({
    baseURL: `${apiBaseUrl}/comments`,
    withCredentials: true
})

const createComment = async (videoId, commentData) => {
    const response = await api.post(`/video/${videoId}/comment`, commentData);
    return response.data;
}

const createReply = async (commentId, commentData) => {
    const response = await api.post(`/comment/${commentId}/comment`, commentData);
    return response.data;
}

const deleteComment = async (commentId) => {
    const response = await api.delete(`/comment/${commentId}`);
    return response.data;
}

export {
    createComment,
    createReply,
    deleteComment
}
