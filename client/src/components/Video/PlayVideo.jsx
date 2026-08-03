import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getVideo } from '../../services/videoService';
import { deleteComment as deleteCommentService } from '../../services/commentSevice';
import { toggleVideoLike, toggleCommentLike } from '../../services/likeService';
import { toggleSubscription } from '../../services/subscriptionService';
import { Button } from '../ui';
import GetAllVideos from './GetAllVideos';
import CreateComment from './CreateComment';
//For thumbs-up icon
import { FiThumbsUp } from "react-icons/fi";

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
  const [commentLikeStates, setCommentLikeStates] = useState({});

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

  const videoLikeMutation = useMutation({
    mutationFn: () => toggleVideoLike(videoId),
    onSuccess: (response) => {
      const nextLiked = Boolean(response?.data?.isLiked);
      setVideo((prev) => prev ? {
        ...prev,
        isLiked: nextLiked,
        likesCount: Math.max(0, (prev.likesCount || 0) + (nextLiked ? 1 : -1))
      } : prev);
    }
  });

  const commentLikeMutation = useMutation({
    mutationFn: (commentId) => toggleCommentLike(commentId),
    onSuccess: (response, commentId) => {
      const nextLiked = Boolean(response?.data?.isLiked);
      setCommentLikeStates((prev) => ({ ...prev, [commentId]: nextLiked }));
      setComments((prev) => prev.map((comment) => comment._id?.toString() === commentId?.toString() ? { ...comment, isLiked: nextLiked } : comment));
    }
  });

  useEffect(() => {
    const payload = videoResponse?.data;
    const normalizedVideo = payload || null;
    const initialLiked = Boolean(
      normalizedVideo?.isLiked ??
      normalizedVideo?.likedBy?.some((likeOwner) => likeOwner?.toString() === currentUser?._id?.toString()) ??
      false
    );

    setVideo(normalizedVideo ? { ...normalizedVideo, isLiked: initialLiked } : null);
    setComments(Array.isArray(normalizedVideo?.comments) ? normalizedVideo.comments : []);
    setIsSubscribed(Boolean(normalizedVideo?.isSubscribed || normalizedVideo?.owner?.isSubscribed || normalizedVideo?.ownerDetails?.[0]?.isSubscribed || false));
  }, [videoResponse, currentUser?._id]);

  useEffect(() => {
    setCommentLikeStates((prev) => {
      const next = { ...prev };
      comments.forEach((comment) => {
        if (!comment?._id || Object.prototype.hasOwnProperty.call(next, comment._id)) return;
        next[comment._id] = Boolean(
          comment?.isLiked ??
          comment?.likedBy?.some((likeOwner) => likeOwner?.toString() === currentUser?._id?.toString()) ??
          false
        );
      });
      return next;
    });
  }, [comments, currentUser?._id]);

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

  const handleVideoLikeToggle = () => {
    if (!currentUser || !videoId || videoLikeMutation.isPending) return;
    videoLikeMutation.mutate();
  };

  const handleCommentLikeToggle = (commentId) => {
    if (!currentUser || !commentId || commentLikeMutation.isPending) return;
    commentLikeMutation.mutate(commentId);
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
    const isCommentLiked = Boolean(commentLikeStates[commentItem._id] ?? false);

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
              <Button
                type="button"
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors ${isCommentLiked ? (theme === 'dark' ? 'bg-white text-gray-950' : 'bg-gray-950 text-white') : (theme === 'dark' ? 'bg-white text-gray-950' : 'bg-gray-950 text-white font-medium')}`}
                onClick={() => handleCommentLikeToggle(commentItem._id)}
                disabled={!currentUser || commentLikeMutation.isPending}
              >
                <span className="text-sm"><FiThumbsUp /></span>
                <span>{isCommentLiked ? 'Liked' : 'Like'}</span>
              </Button>

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
    return <div className={`min-h-screen px-6 py-10 ${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-200 text-gray-950'}`}>Loading video...</div>;
  }

  if (error) {
    return <div className={`min-h-screen px-6 py-10 ${theme === 'dark' ? 'bg-gray-950 text-red-400' : 'bg-gray-200 text-red-600'}`}>Error loading video:{error?.response?.data?.message}</div>;
  }

  return (
    <div className={`min-h-screen overflow-x-hidden ${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-200 text-gray-950'}`}>
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
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleVideoLikeToggle}
                    disabled={!currentUser || videoLikeMutation.isPending}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${Boolean(video?.isLiked) ? (theme === 'dark' ? 'bg-white text-gray-950' : 'bg-gray-950 text-white') : (theme === 'dark' ? 'bg-white text-gray-950' : 'bg-gray-950 text-white font-medium')}`}
                  >
                    <span className="text-base"><FiThumbsUp /></span>
                    <span>{Boolean(video?.isLiked) ? 'Liked' : 'Like'}</span>
                  </Button>
                </div>
                <Button
                  className={`rounded-full px-4 py-2 ${isSubscribed ? (theme === 'dark' ? 'bg-white text-gray-950' : 'bg-gray-950 text-white') : (theme === 'dark' ? 'bg-white text-gray-950' : 'bg-gray-950 text-white font-medium')}`}
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
