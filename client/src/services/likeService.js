import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_WATCHTUBE_API}/likes`,
  withCredentials: true,
});

const toggleVideoLike = async (videoId) => {
  const response = await api.post(`/video/like/${videoId}`);
  return response.data;
};

const toggleCommentLike = async (commentId) => {
  const response = await api.post(`/comment/like/${commentId}`);
  return response.data;
};

export { toggleVideoLike, toggleCommentLike };
