import { asyncHandler, apiError, apiResponse } from '../utils/index.js';
import Video from '../models/video.model.js';
import User from '../models/user.model.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const search = asyncHandler(async (req, res) => {
    const query = req.query?.q?.toString() || req.query?.query?.toString() || '';
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        throw new apiError(400, 'Search query is required');
    }

    const searchRegex = new RegExp(escapeRegex(trimmedQuery), 'i');

    const videos = await Video.find({
        title: { $regex: searchRegex }
    })
        .sort({ createdAt: -1 })
        .populate({
            path: 'owner',
            select: 'username fullName avatar'
        });

    const users = await User.find({
        $or: [
            { username: { $regex: searchRegex } },
            { fullName: { $regex: searchRegex } }
        ]
    })
        .select('_id username fullName avatar')
        .sort({ createdAt: -1 });

    res.status(200).json(
        new apiResponse(200, {
            query: trimmedQuery,
            videos,
            users
        }, 'Search results fetched successfully')
    );
});

export { search };
export default search;
