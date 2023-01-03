import express from "express";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import User from "../models/user.js";
import Post from "../models/post.js";

import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.get("/", async (request, response) => {
  const populateQuery = [
    { path: "author", select: ["username", "profile_image"] },
    {
      path: "comments",
      populate: { path: "author", select: ["username", "profile_image", "created"] },
    },
    {
      path: "likes",
      populate: { path: "author", select: ["username"] },
    },
  ];

  const posts = await Post.find({})
  .sort({ created: -1 })
  .populate(populateQuery)
  .exec();

  response.json(posts);
});

// requireAuth,next
router.post("/",requireAuth, async (request, response, next) => {
  const { text } = request.body;
  const { user } = request.body;

  const post = new Post({
    text: text,
    author: user._id,
  });

  try {
    const savedPost = await post.save();
    user.posts = user.posts.concat(savedPost._id);
    await post.save();
    response.json(savedPost.toJSON());
    return
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (request, response) => {
  const populateQuery = [
    { path: "author", select: ["username", "profile_image"] },
    {
      path: "comments",
      populate: { path: "author", select: ["username", "profile_image"] },
    },
  ];
  const post = await Post.findById(request.params.id)
    .populate(populateQuery)
    .exec();
  if (post) {
    response.json(post.toJSON());
  } else {
    response.status(404).end();
  }
});

// HERE IS THE DELETE FUNCTION 
router.delete("/:id", requireAuth, async (request, response,) => {
  const { userId } = request.body;
  const { id } = request.params;
  const post = await Post.findOne({ _id: id });

  if (!post) {
    return response.status(422).json({ error: "Cannot find post" });
  }
  if (post.author._id.toString() === userId.toString()) {
    try {
      const removedPost = await post.remove();

      const userUpdate = await User.updateOne(
        { _id: userId },
        { $pull: { posts: id } }
      );

      response.json(removedPost);
    } catch (err) {
      next(err);
    }
  }
});
//I TRIED TO CALL IT HERE
// router.delete();

router.all("/like/:postId", requireAuth, async (request, response) => {
  const { postId } = request.params;
  const { user } = request;
  const post = await Post.findOne({ _id: postId });

  if (!post) {
    return response.status(422).json({ error: "Cannot find post" });
  }
  try {
    if (post.likes.includes(user.id)) {
      const result = await post.updateOne({
        $pull: { likes: user.id },
      });

      response.json(result);
    } else {
      const result = await post.updateOne({
        $push: { likes: user.id },
      });

      response.json(result);
    }
  } catch (err) {
    return response.status(422).json({ error: err });
  }
});

router.put("/comments", async (request, response, next) => {
  const { text, userId, postId } = request.body;
  const comment = {
    text: text,
    author: userId,
  };
  const populateQuery = [
    { path: "comments.author", select: ["username", "profile_image"] },
  ];
  Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate(populateQuery)
    .exec((err, result) => {
      if (err) {
        next(err);
      } else {
        response.json(result);
      }
    });
});

export default router;
