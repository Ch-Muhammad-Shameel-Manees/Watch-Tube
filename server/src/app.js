import express from "express";
import cookieParser from "cookie-parser";
import { apiResponse } from "./utils/apiResponse.js";
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)

//Routes
import userRouter from "./routes/user.router.js";
app.use("/api/v1/users", userRouter);

import vidoeRouter from "./routes/video.router.js";
import likeRouter from "./routes/like.router.js";
import commentRouter from "./routes/comment.router.js";
import subscriptionRouter from "./routes/subscription.router.js";
import playlistRouter from "./routes/playlist.router.js";
import searchRouter from "./routes/search.router.js";
app.use("/api/v1/videos", vidoeRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/search", searchRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorStack = err.stack;

  res.status(statusCode).json(
    new apiResponse(statusCode, errorStack , message)
  );
});

export default app;