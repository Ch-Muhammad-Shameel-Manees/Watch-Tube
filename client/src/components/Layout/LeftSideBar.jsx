import { SubscribedChannels } from '../Channel'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

function LeftSideBar() {

    const user = useSelector(state => state.auth.user);
    const theme = useSelector(state => state.theme.theme);

  return (
    <div className={`sticky pl-3 top-15 h-[calc(100vh-4rem)] basis-[20vw] shrink-0 min-w-[15vw] px-2 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-200 text-gray-950'}`}>
        <div className={`flex flex-col gap-3 mt-5 pb-2 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-200'}`}>
            {user && <SubscribedChannels />}
        </div>
        <hr />
        <div className={`flex flex-col mt-4 gap-3 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-200'}`}>
            <h1 className='text-2xl font-bold underline'>You</h1>
            <div className='flex flex-col'>
                {user && <Link
                to={`channel/${user?.username}`}
                className={`rounded-lg px-4 py-2 transition hover:duration-150 ${theme === 'dark' ? 'bg-gray-950 text-gray-200 hover:bg-gray-700' : 'bg-gray-200 text-gray-950 hover:bg-gray-300'}`}
                >Your Channel</Link>}
                <Link
                to='/watch-history'
                className={`rounded-lg px-4 py-2 transition hover:duration-150 ${theme === 'dark' ? 'bg-gray-950 text-gray-200 hover:bg-gray-700' : 'bg-gray-200 text-gray-950 hover:bg-gray-300'}`}
                >History</Link>
                <Link
                to='/playlists'
                className={`rounded-lg px-4 py-2 transition hover:duration-150 ${theme === 'dark' ? 'bg-gray-950 text-gray-200 hover:bg-gray-700' : 'bg-gray-200 text-gray-950 hover:bg-gray-300'}`}
                >Playlists</Link>   
            </div>
        </div>
        <div className=' absolute bottom-10 flex flex-col gap-2'>
            <div className="flex items-center gap-4">
            <a
                href="https://github.com/shameel45"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                GitHub
            </a>

            <a
                href="https://www.linkedin.com/in/chaudhary-muhammad-shameel-manees-479861248/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                LinkedIn
            </a>
            </div>
            <div>
                Created by Me. Just for fun!
            </div>
        </div>
        
        
    </div>
  )
}

export default LeftSideBar