import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserPlaylists } from "../../services/playlistService.js";
import PlaylistCard from "./PlaylistCard.jsx";

  function UserPlaylists() {
    const authStatus = useSelector((state) => state.auth.authStatus);
    const { data: playlists, isLoading, error } = useQuery({
      queryKey: ["getUserPlaylists"],
      queryFn: getUserPlaylists,
      enabled: authStatus,
    });

    return (
      <div className="p-4 w-full h-auto box-border flex flex-wrap gap-4 bg-gray-200 text-gray-950 dark:bg-gray-950 dark:text-gray-200">

        {isLoading && <div>Fetching User Playlists...</div>}
        {error && <div>Error fetching user playlists: {error?.response?.data?.message}</div>}

        {playlists
          ? playlists.data.length > 0 ? playlists.data.map((playlist) => (
              <span className="w-1/4 h-[25vh]" key={playlist._id}>
                <PlaylistCard playlist={playlist} />
              </span>
            )) : <div>You have no playlists!</div>
          : null}

        <div className="w-full flex flex-col gap-3">
          <Link
            to="/playlists/create"
            className="inline-flex w-max items-center justify-center rounded-xl bg-gray-950 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-950 dark:hover:bg-gray-300"
          >
            Create a new Playlist
          </Link>
        </div>
      </div>
    );
}


  export default UserPlaylists;