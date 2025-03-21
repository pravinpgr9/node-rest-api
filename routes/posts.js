const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const User = require("../models/User");

// Create the post
router.post("/", async (req, res) => {
  try {
    const { userId, title, desc, img, likes } = req.body;

    const newPost = new Post({
      userId,
      title, // ✅ Ensure title is stored
      desc,
      img,
      likes: likes || [],
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update the post
router.put("/:postId", async (req, res) => {
  try {
    const { desc, img } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          desc,
          img,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete the post
router.delete("/:postId", async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming the user ID is in the request body
    const postId = req.params.postId;

    const postToDelete = await Post.findOne({ _id: postId, userId: userId });

    if (!postToDelete) {
      // If post with specified ID and user ID doesn't exist
      return res
        .status(404)
        .json({ message: "Post not found or user not authorized to delete." });
    }

    const deletedPost = await Post.findByIdAndDelete(postId);
    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like the post
router.put("/:postId/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({ message: "Post has been liked" });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({ message: "Post has been unliked" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a post
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get post timeline for a user
router.get("/timeline/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the user's friends
    const user = await User.findById(userId);
    const friends = user.friends || [];

    // Include the user's own ID in the list of friends
    friends.push(userId);

    // Fetch posts from the user and their friends
    const timelinePosts = await Post.find({ userId: { $in: friends } })
      .sort({ createdAt: "desc" }) // Sort posts by timestamp in descending order
      .exec();

    res.status(200).json(timelinePosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
