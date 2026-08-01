import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import VideoCard from './VideoCard';
import { useSelector } from 'react-redux';
 
function GetAllVideos({ vertical = false, queryFn }) {

    const [ videos, setVideos ] = useState([])

    const user = useSelector(state => state.auth.user);
    const theme = useSelector(state => state.theme.theme);

    const { data: videosResponse, isPending, error } = useQuery({
        queryKey: ['getAllVideos'],
        queryFn: queryFn
    })

    useEffect(()=> {
        setVideos(videosResponse?.data)
    }, [videos, videosResponse])

  return (
    <div className={`pl-2 py-2 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-200'} ${vertical ? 'min-w-0 w-full' : 'min-w-full'}`}>
        { isPending && <div>Fetching videos....</div> }
        { error && <div>{error?.response?.data?.message}</div> }
        <div className={`flex gap-2 ${vertical ? 'flex-col' : 'flex-wrap'}`}>
            {videos ? (
                    videos.map((video) => (
                        <div key={video._id}>
                            {video.isPublished == true ? video.viewedBy.includes(user?._id) ? (
                            <VideoCard video={video} viewed={true} />
                        ) : <VideoCard video={video}/> : null}
                        </div>
                    ))
            ) : null }
        </div>
    </div>
  )
}

export default GetAllVideos