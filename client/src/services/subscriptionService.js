import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_WATCHTUBE_API}/subscriptions`,
    withCredentials: true
})

const getSubscribedChannels = async () => {
    const response = await api.get("/subscribed-channels");
    return response.data;
}

const toggleSubscription = async (channelId) => {

    try {
        const response = await api.get(`/channel/${channelId}/subscription`);
        return response.data;
    } catch (error) {
        return error?.response?.data?.message;
    }
}

export {
    getSubscribedChannels,
    toggleSubscription
}