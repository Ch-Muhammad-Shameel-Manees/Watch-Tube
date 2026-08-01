import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getChannelVideos } from '../../services/videoService.js';
import { VideoCard } from '../Video';

function GetChannelVideos({username}) {

    const [gotVideos, setGotVideos] = useState([]);
    const theme = useSelector((state) => state.theme.theme);

    const { data : videos, isPending, error } = useQuery({
        queryKey: ['getChannelVideos', username],
        queryFn: () => getChannelVideos(username)
    })

    useEffect(()=> {
        setGotVideos(videos?.data)
    },[videos])

    // console.log("Videos fetched:", gotVideos);

    if (isPending) {
        return <div>Fetching Videos....</div>
    }

    if (error) {
        return <div>{error.response?.data?.message}</div>
    }

  return (
    <div>
        <div className={`flex h-full w-full flex-wrap ${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-200 text-gray-950'}`}>
            {gotVideos ? gotVideos.length == 0 && <div>This channel has no vidoes!</div> : null }
            {gotVideos ? (
                gotVideos.map((video) => (
                    <div
                    key={video._id}
                    className='w-1/3'>
                        <VideoCard video={video} />
                    </div>
                ))
            ) : null}
        </div>
    </div>
  )
}

export default GetChannelVideos