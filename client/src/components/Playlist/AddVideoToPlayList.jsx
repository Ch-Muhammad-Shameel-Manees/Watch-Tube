//Playlist's list for adding videos to them
import { useState } from "react";
import { addVideoToPlaylist, getUserPlaylists } from "../../services/playlistService";
import { useQuery } from "@tanstack/react-query";
import PlaylistCard from "./PlaylistCard";
import { Button } from "../ui";
import { Link } from "react-router-dom";

function AddVideoToPlaylist({videoId, searchStyle}){

    const [ addVideoError, setAddVideoError ] = useState(null);
    const [ isAddVideoLoading, setIsAddVideoLoading ] = useState(false)
    const [ response, setResponse ] = useState(null)

    const { data: playlistsResponse, isLoading, error } = useQuery({
        queryKey: ['getUserPlaylists'],
        queryFn: getUserPlaylists
    })

    console.log("Playlists in AddVideoToPlaylist:" , playlistsResponse);
    console.log("Video Id in AddVideoToPlaylist:", videoId)

    const addVideo = async (playlistId, videoId) => {
        try {
            setResponse(await addVideoToPlaylist(playlistId, videoId));
            setIsAddVideoLoading(true)
        } catch (error) {
            setAddVideoError(error?.response?.data?.message)
            setIsAddVideoLoading(false)
        }
        finally {
            setIsAddVideoLoading(false)
        }
    }

    return (
        <div className={`flex flex-col items-start ${searchStyle ? "h-[20vh] w-[14vw]" : "h-[35vh] w-[15vw]"} overflow-auto rounded-xl bg-gray-200 text-gray-950 dark:bg-gray-950 dark:text-gray-200`}>
            { isLoading && <div>Fetching user playlists....</div> } 
            { error && <div>Error: {error?.response?.data?.message}</div> }
            { playlistsResponse ? playlistsResponse.data.length>0 ? (
                playlistsResponse.data.map(playlist => (
                        <Button
                        onClick={() => addVideo(playlist._id, videoId )}
                        key={playlist._id}
                        className="w-full h-auto px-2 py-1 rounded-2xl bg-gray-200 text-gray-950 dark:bg-gray-950 dark:text-gray-200"
                        >
                            <PlaylistCard playlist={playlist} addVideo={true} />
                        </Button>
                ))
            ) : <div>No playlists available. <Link to="/playlists/create">Add one!</Link> </div>
        : null
        } 
        <Link
          to="/playlists/create"
          className="inline-flex m-auto w-max items-center justify-center rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-950 dark:hover:bg-gray-300"
        >
          Create a new Playlist
        </Link>
        { response && <span className="text-red-500">{response?.message}</span> }
        </div>
        
    )

}

export default AddVideoToPlaylist;