import React from 'react'
import ChannelCard from '../Channel/ChannelCard'
import { Button } from '../ui'
import { logout } from '../../services/userService'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function HeaderProfile({user}) {

    const navigate = useNavigate();
    const theme = useSelector(state => state.theme.theme);

    const logoutUser = async () => {
        await logout()
        navigate(0)
    }

  return (
    <div className={`absolute top-full right-10 z-100 mt-2 flex h-[20vh] w-[20vw] flex-col gap-5 rounded-xl px-10 py-2 shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-950'}`}>
        <ChannelCard channel={user} />
        <Button
        className={`rounded-2xl px-4 py-2 text-lg transition hover:duration-150 ${theme === 'dark' ? 'bg-gray-950 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-950 hover:bg-gray-200'}`}
        onClick={logoutUser}
        >
            Logout
        </Button>
    </div>
  )
}

export default HeaderProfile