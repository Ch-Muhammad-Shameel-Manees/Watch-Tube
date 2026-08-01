import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getChannelProfile } from "../../services/userService";
import { useEffect, useState } from "react";
import { Button } from "../ui";
import { toggleSubscription } from "../../services/subscriptionService";
import GetChannelVideos from "./GetChannelVideos";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function ChannelProfile(){
    const { username } = useParams();
    const authStatus = useSelector(state => state.auth.authStatus);

    const queryClient = useQueryClient();

    const [ channel, setChannel ] = useState(null);
    const theme = useSelector((state) => state.theme.theme);
    const [ isSubscribed, setIsSubscribed ] = useState();
    const [ subscribeResponse, setSubscribeResponse ] = useState(null);
 
    const { data: channelResponse, isPending, error } = useQuery({
        queryKey: ['getChannelProfile', username],
        queryFn: () => getChannelProfile(username)
    })

    
    const toggleChannelSubscription = async () => {
        setSubscribeResponse(await toggleSubscription(channel._id));
        queryClient.invalidateQueries({
            queryKey: ['getSubscribedChannels']
        });
        setIsSubscribed(!isSubscribed);
        console.log("Toggle Subscription function ran!")
    }

    useEffect(() => {
        setChannel(channelResponse?.data)
        setIsSubscribed(channel?.isSubscribed)
    }, [channelResponse, channel, username]);

    useEffect(() => {
        if (!subscribeResponse) return;

        const timer = setTimeout(() => {
            setSubscribeResponse(null);
        }, 2000); // 2 seconds

        return () => clearTimeout(timer);
    }, [subscribeResponse]);

    if (isPending) {
        return <div>Fetching Channel Profile...</div>
    }

    if (error) {
        console.log("Error is:", error)
    }

    // if (!authStatus) {
    //     return <div className="flex items-center justify-center h-full mr-10">
    //         <div className="flex flex-col gap-6 items-center">
    //             <span className="text-xl text-red-400">You are not logged in!</span>                
    //             <div className="flex gap-3 items-center">
    //                 <span>Login to view content:</span>
    //                 <Link
    //                         to="/login"
    //                         className={`w-20 rounded-xl border px-1 py-3 text-center text-xl font-medium transition ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-950 hover:bg-gray-100'}`}
    //                         >
    //                             Login
    //                 </Link> 
    //             </div>
                
    //         </div>
    //     </div>
    // }

    return (
        <div className={`min-w-0 flex-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-200 text-gray-950'}`}>
            <div className={`flex flex-1 flex-col gap-3 px-6 ${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-200 text-gray-950'}`}>
                <div 
                className={`w-full px-3 py-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
                >
                    <img src={channel?.coverImage ? channel?.coverImage : null} alt="Cover Image"
                    className="w-full h-[30vh] rounded-2xl object-cover"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <img src={channel?.avatar} alt="Avatar" 
                    className="rounded-full h-[10vh] w-[5vw] object-cover"
                    />
                    <div className="flex flex-col justify-start gap-3 ml-2">
                        <h1
                        className="font-bold text-xl"
                        >{channel?.username}</h1>
                        <div className="flex gap-3">
                            <span>@{channel?.fullName}</span>
                            <span>{channel?.subscribers} Subscribers</span>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Button
                            className={`inline rounded-4xl px-4 py-2 ${isSubscribed ? (theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-white') : (theme === 'dark' ? 'bg-white text-gray-950 font-medium' : 'bg-gray-100 text-gray-950 font-medium')}`}
                            onClick={toggleChannelSubscription}
                            disabled={!authStatus}
                            >
                                {isSubscribed ? "Unsubscribe" : "Subscribe"}
                            </Button>
                            {subscribeResponse && <div className="text-red-500 inline">{subscribeResponse?.message}!</div> }
                        </div>
                    </div>
                </div>  
                <div>
                    <GetChannelVideos username={username} />
                </div>
            </div>
                    
        </div>
    )
}

export default ChannelProfile;