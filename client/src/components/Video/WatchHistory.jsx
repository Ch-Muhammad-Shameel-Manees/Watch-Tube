import { getUserWatchHistory } from "../../services/userService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";
import { Link } from "react-router-dom";

const WatchHistory = () => {
  const theme = useSelector((state) => state.theme.theme);
  const authStatus = useSelector(state => state.auth.authStatus);
  console.log("Auth Status in WatchHistory:", authStatus);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userWatchHistory"],
    queryFn: getUserWatchHistory,
    enabled: authStatus
  });

  const videos = data?.data?.watchHistory || [];

  if (isLoading) {
    return (
      <div className={`flex min-h-screen items-center justify-center px-4 ${theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-gray-200 text-gray-950'}`}>
        <div className={`rounded-2xl border px-6 py-4 ${theme === 'dark' ? 'border-red-900/40 bg-[#171717] text-red-400' : 'border-gray-300 bg-white text-red-600'}`}>
          Loading watch history...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`flex min-h-screen items-center justify-center px-4 ${theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-gray-200 text-gray-950'}`}>
        <div className={`rounded-2xl border px-6 py-4 ${theme === 'dark' ? 'border-red-900/40 bg-[#171717] text-red-400' : 'border-gray-300 bg-white text-red-600'}`}>
          {error instanceof Error ? error.message : "Failed to load watch history"}
        </div>
      </div>
    );
  }


  return (
    <>
        <div className={`px-4 py-4 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>Watch History:</div>
        <div className="flex flex-wrap gap-3"> 
            {videos ? (
                videos.map((video) => (
                    <VideoCard video={video} />
                ))
            ) : null }
        </div>
    </>
  );
};

export default WatchHistory;
