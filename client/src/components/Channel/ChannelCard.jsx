import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from '../ui'

function ChannelCard({channel, className = ''}) {
  const theme = useSelector((state) => state.theme.theme);

  const baseClasses = `min-w-[15vw] rounded-lg px-4 py-2 duration-300 ease-in-out ${theme === 'dark' ? 'bg-gray-950 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-950 hover:bg-gray-200'}`;

  if (className) {
    return (
      <Link
        to={`/channel/${channel.username}`}
        className={`flex items-center gap-4 rounded-2xl border border-gray-300 bg-white px-4 py-4 text-gray-950 shadow-sm transition-colors duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 ${className}`}
      >
        <img
          src={channel.avatar}
          alt="Avatar"
          className="h-16 w-16 rounded-full object-cover"
        />
        <span className="text-xl font-semibold">{channel.username}</span>
      </Link>
    );
  }

  return (
    <Button className={baseClasses}>
      <Link
        to={`/channel/${channel.username}`}
        className="flex items-center justify-between gap-2 px-6"
      >
        <img
          src={channel.avatar}
          alt="Avatar"
          className="max-h-10 min-w-10 max-w-10 rounded-full object-cover"
        />
        <span className="font-bold">{channel.username}</span>
      </Link>
    </Button>
  )
}

export default ChannelCard