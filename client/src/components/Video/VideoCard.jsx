import React, { useEffect, useState } from 'react'
import { SaveToPlaylistButton } from '../../assets';
import { Button } from '../ui';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { addVideoToPlaylist, removeVideoFromPlaylist } from '../../services/playlistService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function VideoCard({video, viewed, searchStyle = false, playlist_id}) {

    const [ error, setError ] = useState()
    const [ageofVideo, setAgeOfVideo] = useState(null);
    const [ duration, setDuration ] = useState(null)
    const theme = useSelector(state => state.theme.theme);

    const videoCreatedAt = new Date(video.createdAt);
    const now = new Date();
    const ageInMilliseconds = now - videoCreatedAt;
    //Add the logic for minutes ago tooo
    const hoursAgo = Math.floor(ageInMilliseconds / (1000 * 60 * 60));
    const daysAgo = hoursAgo>24 ? Math.floor(hoursAgo / 24) : null; 
    const yearsAgo = daysAgo>365 ? Math.floor(daysAgo / 360) : null;

    
    useEffect(()=> {

        if (hoursAgo > 24) {
            setAgeOfVideo(daysAgo);
            if (daysAgo > 365) {
                setAgeOfVideo(yearsAgo)
            }
        }
        else{
            setAgeOfVideo(hoursAgo)
        }
        const durationInSecondsString = String(video?.duration);
        const splitDurationInSeconds = durationInSecondsString.split(".")
        const numberOfSeconds = splitDurationInSeconds.at(-2);
        const seconds = numberOfSeconds % 60;
        const minutes = seconds ? Math.floor(numberOfSeconds/ 60)  : null;
        const hoursExist = seconds>3600 ? Math.floor(numberOfSeconds/ 3600 ) : null;
        const hours = hoursExist ? String(hoursExist) + ":" : null;
        setDuration(`${hoursExist ? hours : "" }${minutes}:${seconds}`)
    },[hoursAgo, video?.duration])

    const addToPlaylist = async () => {
        try {
            await addVideoToPlaylist(playlist_id, video._id)
        } catch (error) {
            setError(error?.response?.data?.message)
        }
    }

    const queryClient = useQueryClient();

    const removeMutation = useMutation({
        mutationFn: ({ playlistId, videoId }) => removeVideoFromPlaylist(playlistId, videoId),
        onSuccess: () => {
            queryClient.invalidateQueries(["getPlaylistVideos", playlist_id]);
        }
    })

    const removeFromPlaylist = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!confirm('Remove this video from playlist?')) return;
        removeMutation.mutate({ playlistId: playlist_id, videoId: video._id });
    }

  return (
    <div className={`${video ? "block" : "hidden"}`}>
        {video ? 
            <div className={`flex ${searchStyle ? "w-[50vw] h-[30vh]" : "w-[23vw] h-auto"} overflow-hidden rounded-2xl border transition-colors duration-300 ${searchStyle ? 'flex-row items-start gap-4 p-3' : 'flex-col'} ${theme === 'dark' ? 'border-gray-700 bg-gray-950 text-gray-200 hover:bg-gray-800' : 'border-gray-200 bg-white text-gray-950 hover:bg-gray-100'} hover:duration-900 duration-900 ease-in-out`}>
                { error && <div>Error: {error}</div> }
                <Link to={`/video/${video._id}`}>
                <div className={`relative cursor-pointer ${searchStyle ? 'h-48 w-full shrink-0 p-1 hover:p-0' : 'h-[28vh] w-full p-1 hover:p-0 hover:duration-150 duration-150'}`}>
                    {viewed ? (
                        <span className='bg-black text-red-400 px-2 py-1 mt-1 absolute left-2 top-1 z-10'>
                            Watched
                        </span>
                    ) : null}
                    <img src={video.thumbnail} alt="Thumbnail" 
                    className={`h-full w-full object-cover ${searchStyle ? 'rounded-xl' : 'rounded-t-xl'}`}
                    />
                    <span 
                    className={`absolute bottom-2 right-2 rounded-full px-2 py-1 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-950'}`}
                    >
                        {duration}
                    </span>
                </div>
                </Link>
                <div className={`flex flex-1 ${searchStyle ? 'flex-row items-start justify-between gap-4' : 'flex-col justify-between p-3'}`}>
                    <div className='flex flex-1 flex-col gap-3'>
                        <h1 className={`truncate w-full h-7 ${searchStyle ? 'text-2xl' : 'text-lg'} font-bold`}>{video.title}</h1>
                        <div className={`flex ${searchStyle ? 'flex-wrap items-center gap-3 text-sm' : 'flex-wrap items-center gap-4 text-base'}`}>
                            <div className='flex items-center gap-3'>
                                <img src={video.owner?.avatar} alt="avatar" 
                                className='h-10 w-10 rounded-full object-cover'
                                />
                                <Link to={`/channel/${video.owner?.username}`}
                                className={`hover:duration-100 ${theme === 'dark' ? 'hover:text-gray-400' : 'hover:text-gray-700'}`}
                                >
                                    {video.owner?.username}
                                </Link>
                            </div>
                            <span>{video.views} views</span>
                            <span>{ageofVideo}{yearsAgo ? "y ago" : (daysAgo ? "d ago" : "hours ago")}</span>
                            {searchStyle ? (
                            <span className='flex items-center justify-center p-4 w-10 h-10 hover:duration-150 duration-150 hover:rounded-full hover:bg-gray-400 shrink-0'>
                                    <SaveToPlaylistButton searchStyle={searchStyle} videoId={video._id} />
                            </span>
                        ) : (
                            <span className='flex items-center justify-center p-4 w-10 h-10 hover:duration-150 duration-150 hover:rounded-full hover:bg-gray-400'>
                                    <SaveToPlaylistButton videoId={video._id} />
                            </span>
                        )}
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        
                        {playlist_id && (
                            <button
                                onClick={removeFromPlaylist}
                                disabled={removeMutation.isLoading}
                                className={`rounded-lg cursor-pointer px-3 py-2 text-sm font-medium transition ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'} disabled:opacity-60 disabled:cursor-wait`}
                            >
                                {removeMutation.isLoading ? 'Removing...' : 'Remove from Playlist'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        :  null  }
        
    </div>
  )
}

export default VideoCard