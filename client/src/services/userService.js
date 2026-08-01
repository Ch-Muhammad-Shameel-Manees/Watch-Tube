import axios from "axios"
import { apiBaseUrl } from "../utils/constants.js"

const api = axios.create({
    baseURL: `${apiBaseUrl}/users`,
    withCredentials: true
})

const registerUser = async (user) => {

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("fullName", user.fullName);
    formData.append("password", user.password);
    formData.append("avatar", user.avatar);
    formData.append("coverImage", user.coverImage);

    const response = await api.post("/register", formData);
    return response.data;
}

const loginUser = async (user) => {
    const response = await api.post("/login", user);
    return response.data;
}

const getCurrentUser = async () => {
    const response = await api.get("/getCurrentUser");
    return response.data;
}

const logout = async () => {
    const response = await api.get("/logout");
    return response.data;
}

const getUserWatchHistory = async () => {
    const response = await api.get("/watch-history");
    return response.data;
}

const getChannelProfile = async (username) => {
    const response = await api.get(`/c/${username}`);
    return response.data;
}

export {
    registerUser,
    loginUser,
    getCurrentUser,
    logout,
    getUserWatchHistory,
    getChannelProfile
}