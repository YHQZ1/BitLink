// src/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.username, // Using username as name
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updates = {};
    const changes = [];

    // Update username if provided and changed
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }
      user.username = username;
      updates.username = username;
      changes.push("username");
    }

    // Update email if provided and changed
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      user.email = email;
      updates.email = email;
      changes.push("email");
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required to set new password" });
      }
      
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long" });
      }

      user.password = newPassword;
      changes.push("password");
    }

    // If no changes were made
    if (changes.length === 0) {
      return res.status(400).json({ error: "No changes made to profile" });
    }

    await user.save();

    res.json({
      message: `Profile updated successfully. Changed: ${changes.join(", ")}`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.username,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};