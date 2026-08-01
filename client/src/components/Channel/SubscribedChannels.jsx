import { useEffect, useState } from "react";
import { getSubscribedChannels } from "../../services/subscriptionService";
import { useQuery } from '@tanstack/react-query';
import ChannelCard from "./ChannelCard";

function SubscribedChannels() {

    const {data: channelsResponse, isPending, error} = useQuery({
        queryKey: ['getSubscribedChannels'],
        queryFn: getSubscribedChannels
    });

    const channels = channelsResponse?.data;
    
    if (isPending) {
        return <div>Fetching subscribed Channels</div>
    }

    if (error) {
        return <div>Error fetching channels: {error.response?.data?.message}</div>
    }

    return (
        <>
            <h1 className="font-bold text-xl underline">Subscriptions</h1>
            <div 
            className="flex flex-col gap-2 w-[10vw]"
            >
                {channels ? (
                    channels.length > 0 ? channels.map((channel) => (
                        <div key={channel._id}>
                            <ChannelCard channel={channel} />
                        </div>
                    )) : <div>No Subscriptions yet!</div>
                ) : null }
            </div>
        </>
    )
}

export default SubscribedChannels;