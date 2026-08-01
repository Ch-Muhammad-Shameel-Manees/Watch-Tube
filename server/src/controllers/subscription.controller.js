import { asyncHandler, apiError, apiResponse } from "../utils/index.js";
import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id;

    if (!channelId) {
        throw new apiError(400, "Channel Id is required!")
    }

    if (subscriberId.toString() === channelId.toString()) {
        throw new apiError(400, "You cannot subscribe to yourself")
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new apiError(404, "Channel not found!")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channel._id
    });

    if (existingSubscription) {
        await existingSubscription.deleteOne();

        return res
            .status(200)
            .json(
                new apiResponse(200, { isSubscribed: false }, "Subscription removed")
            )
    }

    await Subscription.create({
        subscriber: subscriberId,
        channel: channel._id
    });

    res
        .status(200)
        .json(
            new apiResponse(200, { isSubscribed: true }, "Subscribed successfully")
        )
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriberId = req.user._id;

    const subscriptions = await Subscription.find({
        subscriber: subscriberId
    }).populate({
        path: "channel",
        select: "username fullName avatar"
    });

    const channels = subscriptions.map((subscription) => subscription.channel);

    res
        .status(200)
        .json(
            new apiResponse(200, channels, "Subscribed channels fetched successfully")
        )
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new apiError(400, "Channel Id is required!")
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new apiError(404, "Channel not found!")
    }

    const subscriptions = await Subscription.find({
        channel: channel._id
    }).populate({
        path: "subscriber",
        select: "username fullName avatar"
    });

    const subscribers = subscriptions.map((subscription) => subscription.subscriber);

    res
        .status(200)
        .json(
            new apiResponse(200, subscribers, "Channel subscribers fetched successfully")
        )
});

export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers
};
