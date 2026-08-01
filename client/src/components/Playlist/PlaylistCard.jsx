import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePlaylist } from "../../services/playlistService.js";

function PlaylistCard({ playlist, addVideo = false }) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries(["getUserPlaylists"]);
    },
    onSettled: () => setDeleting(false),
  });

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;
    setDeleting(true);
    deleteMutation.mutate(id);
  };

  const cardContent = (
    <div className={`flex flex-col rounded-l-none w-full max-w-[20vw] h-full max-h-full rounded-3xl bg-gray-950 text-gray-200 dark:bg-gray-200 dark:text-gray-950 hover:bg-gray-400 hover:duration-150 duration-150 ${addVideo ? "flex-row" : "justify-around"}`}>
      <div className={`flex items-center justify-between gap-3 px-4 py-3 ${addVideo ? "flex-col" : ""}`}>
        <div className={`rounded-2xl ${addVideo ? "h-[6vh] w-[4vw]" : "h-[8vh] w-[10vw]"}`}>
          <img
            src="https://voca-land.sgp1.cdn.digitaloceanspaces.com/43844/1648964675358/33f04ab180c7440fcc1d48240982f6087944d58c53decb6d582bc903cba0724d.jpg"
            alt="Playlist"
            className='w-fit h-full'
          />
        </div>
        {!addVideo && <div>
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDelete(playlist?._id); }}
            disabled={deleting}
            className="mr-2 rounded-xl bg-red-500 cursor-crosshair px-2 py-1 text-white hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-wait"
            aria-label="Delete playlist"
          >
            {deleting && deleteMutation.isLoading ? "Deleting..." : "Delete"}
          </button>
        </div> }
      </div>

      <div className={`${addVideo ? "text-center flex justify-center items-center" : 'flex flex-col mt-2 gap-3 px-4 py-2'}`}>
        <h1 className={`font-medium font-serif ${addVideo ? "text-sm" : "text-2xl"}`}>{playlist?.name}</h1>
        {!addVideo && <span className='text-sm'>{playlist?.description}</span>}
      </div>
    </div>
  );

  return addVideo ? (
    <div>{cardContent}</div>
  ) : (
    <Link to={`/playlists/${playlist?._id}`}>{cardContent}</Link>
  );
}

export default PlaylistCard;