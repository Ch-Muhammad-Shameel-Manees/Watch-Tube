import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlaylist } from "../../services/playlistService.js";
import { Container } from "../ui";

function CreatePlaylist() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const mutation = useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries(["getUserPlaylists"]);
      navigate("/playlists");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ name, description });
  };

  return (
    <div className="min-h-screen bg-gray-200 px-4 py-8 transition-colors duration-300 dark:bg-gray-950">
      <Container>
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-300 bg-white/95 p-8 shadow-xl shadow-gray-300/50 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900/95 dark:shadow-black/20">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-950 dark:text-gray-100">Create Playlist</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Add a new playlist name and description, then submit to save it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Playlist Name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Enter playlist name"
                className="w-full rounded-2xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter playlist description"
                rows={5}
                className="w-full rounded-2xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-gray-900 px-6 py-3 text-sm font-semibold text-gray-200 transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70 dark:bg-gray-200 dark:text-gray-950 dark:hover:bg-gray-300"
              >
                {mutation.isLoading ? "Creating playlist..." : "Create Playlist"}
              </button>

              {mutation.isError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {mutation.error?.response?.data?.message || "Unable to create playlist."}
                </p>
              )}
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default CreatePlaylist;
