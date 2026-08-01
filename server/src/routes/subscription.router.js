import { Router } from 'express';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import { toggleSubscription, getSubscribedChannels, getUserChannelSubscribers } from '../controllers/subscription.controller.js';

const router = Router();

router.route('/channel/:channelId/subscription').get(
    verifyJWT,
    toggleSubscription
);

router.route('/subscribed-channels').get(
    verifyJWT,
    getSubscribedChannels
);

router.route('/channel/:channelId/subscribers').get(
    verifyJWT,
    getUserChannelSubscribers
);

export default router;
