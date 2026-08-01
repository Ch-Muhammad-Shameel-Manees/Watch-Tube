import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_WATCHTUBE_API}/search`,
    withCredentials: true
})

const searchResult = async (searchQuery) => {
    const response = await api.get("", {
        params: {
            q: searchQuery
        }
    });
    return response.data;
}

export {
    searchResult
}