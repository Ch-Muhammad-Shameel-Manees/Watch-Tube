import { Button } from '../ui'
import { useState } from 'react'
import AddVideoToPlaylist from './AddVideoToPlayList'

function SaveToPlaylistButton({videoId, searchStyle = false}) {

  const [ showPlaylists, setShowPlaylists ] = useState(false)

  return (
    <span className='relative mt-2'>
      <Button
      onClick={() => setShowPlaylists(!showPlaylists)}
      className=" bg-transparent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="black"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </Button>
      { showPlaylists && <span className={`absolute ${searchStyle ? "right-7 -top-10" : "right-6 bottom-3"}`}>
        <AddVideoToPlaylist searchStyle={searchStyle} videoId={videoId} /> 
      </span> }
    </span>
  )
}

export default SaveToPlaylistButton