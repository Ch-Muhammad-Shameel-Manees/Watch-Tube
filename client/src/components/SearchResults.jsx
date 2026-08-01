import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { searchResult } from '../services/searchService';
import { VideoCard } from './Video';
import { ChannelCard } from './Channel';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') ?? '';
    const theme = useSelector((state) => state.theme.theme);

    const { data, isPending, error } = useQuery({
        queryKey: ['searchResults', searchQuery],
        queryFn: () => searchResult(searchQuery),
        enabled: Boolean(searchQuery),
        staleTime: 1000 * 60 * 5,
    });

    const videos = data?.data?.videos || [];
    const users = data?.data?.users || [];

    return (
        <div className={`min-h-screen px-4 py-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-100 text-gray-950'}`}>
            <div className="mb-6 flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">
                    {searchQuery ? `Search results for "${searchQuery}"` : 'Search videos'}
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {searchQuery
                        ? ''
                        : 'Enter a search term from the header to find videos.'}
                </p>
            </div>

            {isPending && <p className="text-lg">Loading results...</p>}

            {!searchQuery && !isPending && (
                <p className={`rounded-xl border p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'}`}>
                    Use the search bar to look for videos and channels.
                </p>
            )}

            {error && (
                <p className={`rounded-xl border p-4 ${theme === 'dark' ? 'border-red-700 bg-red-950/40' : 'border-red-300 bg-red-50'}`}>
                    Unable to load search results right now.
                </p>
            )}

            {!isPending && searchQuery && !error && videos.length === 0 && users.length === 0 && (
                <p className={`rounded-xl border p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'}`}>
                    No videos or channels matched your search.
                </p>
            )}

            {!isPending && searchQuery && (videos.length > 0 || users.length > 0) && (
                <div className="space-y-8">
                    {users.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-xl font-semibold">Channels</h2>
                            <div className="flex flex-row flex-wrap gap-4">
                                {users.map((channel) => (
                                    <ChannelCard
                                        key={channel._id || channel.id}
                                        channel={channel}
                                        className="w-full max-w-[15vw] rounded-2xl border border-gray-300 bg-white px-4 py-4 text-gray-950 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {videos.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-xl font-semibold">Videos</h2>
                            <div className="flex flex-col gap-4">
                                {videos.map((video) => (
                                    <VideoCard key={video._id || video.id} video={video} searchStyle />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchResults;
