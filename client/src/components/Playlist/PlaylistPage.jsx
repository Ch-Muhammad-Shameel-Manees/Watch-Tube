import GetAllVideos from "../Video/GetAllVideos";
import { getPlaylistById } from "../../services/playlistService";
import { useParams } from 'react-router';
import { useQuery } from "@tanstack/react-query";
import { VideoCard } from "../Video";


function PlaylistPage() {

    const { playlistId } = useParams();

    const { data: playlistResponse, isLoading, error } = useQuery({
        queryKey: ['getPlaylistVideos', playlistId],
        queryFn: () => getPlaylistById(playlistId),
    })

    console.log("Playlist we got:", playlistResponse)

  return (
    <div className="pl-10 mt-7 flex flex-col gap-4">
        { isLoading && <div>Fetching Playlist Videos...</div> }
        { error && <div>Error fetching videos: {error?.response?.data?.message}</div> }
        <div>
            { playlistResponse?.data?.name && <div className="font-bold text-2xl">Playlist: {playlistResponse?.data?.name}</div> }
            { playlistResponse?.data?.description && <div>{playlistResponse?.data?.description}</div> }
        </div>
        <div className="flex gap-3 flex-wrap">
        { playlistResponse ? (
            playlistResponse.data.videos.length>0 ? (
                playlistResponse.data.videos.map(playlistVideo => (
                    
                        <VideoCard playlist_id={playlistId} video={playlistVideo} />
                    
                ))
            ) : <div>This playlist has no videos!</div>
        ) : null }   
        </div> 
    </div>
  )
}

export default PlaylistPage