import { GetAllVideos } from './Video';
import { getAllVideos } from '../services/videoService.js'

function Dashboard(){
    return (
        <div className='pl-10 mt-7'>
            <GetAllVideos queryFn={getAllVideos}/>
        </div>
    )
}

export default Dashboard;