const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/", (req, res) => {
  res.send("welcome to user routes rest API");
});

// UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    // Check if the user is authorized to update the account
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      // Hash the password if provided in the request
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      // Update the user
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      // If the user is not found
      if (!updatedUser) {
        return res.status(404).json({ error: "User Not Found" });
      }

      // Success response
      res
        .status(200)
        .json({ message: "Account has been updated", user: updatedUser });
    } else {
      // Unauthorized to update the account
      res.status(403).json({
        error:
          "Forbidden - You can only update your account or an admin can update any account",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete the user

router.delete("/:id", async (req, res) => {
  try {
    // Check if the user is authorized to delete the account
    if (
      req.user &&
      (req.user._id.toString() === req.params.id || req.user.isAdmin)
    ) {
      // Find the user
      const userToDelete = await User.findById(req.params.id);

      // If the user is not found
      if (!userToDelete) {
        return res.status(404).json({ error: "User Not Found" });
      }

      // Delete the user
      await User.findByIdAndDelete(req.params.id);

      // Success response
      res.status(200).json({ message: "Account has been Deleted" });
    } else {
      // Unauthorized to delete the account
      res.status(403).json({
        error:
          "Forbidden - You can only delete your account or an admin can delete any account",
      });
    }
  } catch (err) {
    console.error(err);
    // Handle specific error cases
    if (err.name === "CastError") {
      // Invalid user ID format
      res.status(400).json({ error: "Invalid user ID format" });
    } else {
      // Internal Server Error
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// GET USER BY ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Exclude sensitive information like password before sending the response
    const { _id, username, email } = user;

    res.status(200).json({ _id, username, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// FOLLOW USER
router.put("/:id/follow", async (req, res) => {
  try {
    const currentUserId = req.body.userId;
    const userToFollowId = req.params.id;

    // Check if the user to follow exists
    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({ error: "User to follow not found" });
    }

    // Check if the current user ID is provided
    if (!currentUserId) {
      return res
        .status(400)
        .json({ error: "Current user ID is missing in the request body" });
    }

    // Find the current user by ID
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    // Check if the current user is trying to follow themselves
    if (currentUser._id.toString() === userToFollowId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    // Check if the user is already being followed
    if (currentUser.followings.includes(userToFollowId)) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    // Update current user's following list
    currentUser.followings.push(userToFollowId);
    await currentUser.save();

    // Update user to follow's followers list
    userToFollow.followers.push(currentUserId);
    await userToFollow.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// UNFOLLOW USER
router.put("/:id/unfollow", async (req, res) => {
  try {
    const currentUserId = req.body.userId;
    const userToUnfollowId = req.params.id;

    // Check if the user to unfollow exists
    const userToUnfollow = await User.findById(userToUnfollowId);
    if (!userToUnfollow) {
      return res.status(404).json({ error: "User to unfollow not found" });
    }

    // Check if the current user ID is provided
    if (!currentUserId) {
      return res
        .status(400)
        .json({ error: "Current user ID is missing in the request body" });
    }

    // Find the current user by ID
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    // Check if the current user is trying to unfollow themselves
    if (currentUser._id.toString() === userToUnfollowId) {
      return res.status(400).json({ error: "Cannot unfollow yourself" });
    }

    // Check if the user is being followed
    if (!currentUser.followings.includes(userToUnfollowId)) {
      return res.status(400).json({ error: "You are not following this user" });
    }

    // Remove user to unfollow from current user's following list
    currentUser.followings = currentUser.followings.filter(
      (id) => id.toString() !== userToUnfollowId
    );
    await currentUser.save();

    // Remove current user from user to unfollow's followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId
    );
    await userToUnfollow.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
