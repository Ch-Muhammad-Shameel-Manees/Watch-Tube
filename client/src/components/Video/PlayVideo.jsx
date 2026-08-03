import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getVideo } from '../../services/videoService';
import { deleteComment as deleteCommentService } from '../../services/commentSevice';
import { toggleSubscription } from '../../services/subscriptionService';
import { Button } from '../ui';
import GetAllVideos from './GetAllVideos';
import CreateComment from './CreateComment';

function PlayVideo() {
  const { videoId } = useParams();
  const currentUser = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.theme.theme);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeResponse, setSubscribeResponse] = useState(null);
  const [replyingToId, setReplyingToId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const { data: videoResponse, isPending, error, refetch: refetchVideo } = useQuery({
    queryKey: ['getVideo', videoId],
    queryFn: () => getVideo(videoId),
    enabled: !!videoId,
  });

  const owner = useMemo(() => video?.owner || video?.ownerDetails?.[0] || null, [video]);

  const deleteMutation = useMutation({
    mutationFn: deleteCommentService,
    onSuccess: async (_, deletedCommentId) => {
      setDeleteError('');
      await refetchVideo();
      setReplyingToId(null);
    },
    onError: (error) => {
      setDeleteError(error?.response?.data?.message || 'Unable to delete comment');
    }
  });

  useEffect(() => {
    const payload = videoResponse?.data;
    setVideo(payload || null);
    setComments(Array.isArray(payload?.comments) ? payload.comments : []);
    setIsSubscribed(Boolean(payload?.isSubscribed || payload?.owner?.isSubscribed || payload?.ownerDetails?.[0]?.isSubscribed || false));
  }, [videoResponse]);

  useEffect(() => {
    if (!subscribeResponse) return;

    const timer = setTimeout(() => {
      setSubscribeResponse(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [subscribeResponse]);

  const toggleChannelSubscription = async () => {
    if (!owner?._id && !video?.owner) return;

    const channelId = owner?._id || video?.owner;
    const result = await toggleSubscription(channelId);
    setSubscribeResponse(typeof result === 'string' ? result : result?.message || 'Subscription updated');
    setIsSubscribed((prev) => !prev);
  };

  const videoSrc = video?.videoFile || video?.videoUrl || video?.url || video?.fileUrl;

  const isCommentOwner = (comment) => {
    const ownerId = comment?.owner?._id || comment?.owner || comment?.ownerDetails?._id || comment?.ownerDetails?.[0]?._id || comment?.user?._id;
    return Boolean(ownerId && currentUser?._id && ownerId.toString() === currentUser._id.toString());
  };

  const handleCommentAdded = async (response) => {
    const createdComment = response?.data || response;
    if (!createdComment?._id) {
      await refetchVideo();
      setReplyingToId(null);
      return;
    }

    await refetchVideo();
    setReplyingToId(null);
  };

  const renderComment = (commentItem, depth = 0) => {
    const replies = comments.filter((item) => item.parentComment?.toString() === commentItem._id?.toString());

    return (
      <div key={commentItem._id} className={`mb-4 border-b pb-3 last:border-b-0 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'} ${depth ? 'ml-6' : ''}`}>
        <div className="flex items-start gap-3">
          <img
            src={commentItem.ownerDetails?.avatar || commentItem.user?.avatar || '/default-avatar.png'}
            alt="Comment author"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>
                {commentItem.ownerDetails?.username || commentItem.user?.username || 'User'}
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                {commentItem.createdAt ? new Date(commentItem.createdAt).toLocaleDateString() : ''}
              </span>
            </div>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {commentItem.content || commentItem.text || commentItem.body || 'No comment text.'}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={`text-sm ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
                onClick={() => setReplyingToId(replyingToId === commentItem._id ? null : commentItem._id)}
              >
                {replyingToId === commentItem._id ? 'Cancel' : 'Reply'}
              </button>

              {isCommentOwner(commentItem) && (
                <button
                  type="button"
                  className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-950'}`}
                  onClick={() => deleteMutation.mutate(commentItem._id)}
                  disabled={deleteMutation.isPending && deleteMutation.variables === commentItem._id}
                >
                  {deleteMutation.isPending && deleteMutation.variables === commentItem._id ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>

            {replyingToId === commentItem._id && (
              <div className="mt-3">
                <CreateComment
                  videoId={videoId}
                  parentCommentId={commentItem._id}
                  placeholder="Write a reply..."
                  buttonText="Reply"
                  onSuccess={handleCommentAdded}
                  onError={() => {}}
                />
              </div>
            )}

            {replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {replies.map((reply) => renderComment(reply, depth + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isPending) {
    return <div className={`min-h-screen px-6 py-10 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-200 text-gray-950'}`}>Loading video...</div>;
  }

  if (error) {
    return <div className={`min-h-screen px-6 py-10 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-red-400' : 'bg-gray-200 text-red-600'}`}>Error loading video:{error?.response?.data?.message}</div>;
  }

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-200 text-gray-950'}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 xl:flex-row">
        <div className="flex-1 min-w-0">
          <div className={`w-full overflow-hidden rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-black' : 'bg-gray-300'}`}>
            {videoSrc ? (
              <video
                controls
                autoPlay
                className="aspect-video w-full"
                src={videoSrc}
                poster={video?.thumbnail}
              />
            ) : (
              <div className={`flex aspect-video items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-300 text-gray-600'}`}>
                Video unavailable
              </div>
            )}
          </div>

          <div className={`mt-4 rounded-2xl p-4 shadow-sm ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{video?.title || 'Untitled video'}</h1>

            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Link to={`/channel/${owner?.username || ''}`} className="flex items-center gap-3">
                  <img
                    src={owner?.avatar || '/default-avatar.png'}
                    alt="Owner"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{owner?.username || 'Channel'}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{owner?.fullName || 'Owner name'}</p>
                    {owner?.email ? <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>{owner.email}</p> : null}
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{video?.views || 0} views</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{video?.likesCount || 0} likes</span>
                <Button
                  className={`rounded-full px-4 py-2 ${isSubscribed ? (theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-white') : (theme === 'dark' ? 'bg-white text-gray-950' : 'bg-gray-200 text-gray-950 font-medium')}`}
                  onClick={toggleChannelSubscription}
                  disabled={!currentUser}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Button>
              </div>
            </div>

            {subscribeResponse && (
              <p className="mt-3 text-sm text-red-400">{subscribeResponse}</p>
            )}

            <p className={`mt-4 text-sm leading-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{video?.description || 'No description available.'}</p>
          </div>

          <div className={`mt-6 rounded-2xl p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className={`mb-4 text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>{comments.length} Comments</h2>

            <div className={`mb-6 rounded-xl border p-3 ${theme === 'dark' ? 'border-gray-800 bg-gray-950' : 'border-gray-300 bg-gray-100'}`}>
              <CreateComment
                videoId={videoId}
                placeholder="Write a comment..."
                buttonText="Comment"
                onSuccess={handleCommentAdded}
                onError={() => {}}
              />
            </div>

            {deleteError && <p className="mb-3 text-sm text-red-400">{deleteError}</p>}

            {comments.filter((comment) => !comment.parentComment).length ? (
              comments.filter((comment) => !comment.parentComment).map((comment) => renderComment(comment))
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No comments yet.</p>
            )}
          </div>
        </div>

        <aside className="w-full xl:w-90 shrink-0">
          <div className={`w-full rounded-2xl p-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className={`mb-3 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-950'}`}>Up next</h3>
            <GetAllVideos vertical />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PlayVideo;
