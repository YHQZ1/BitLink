import { getUserById, updateUser } from "../services/user.service.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error("Get current user error:", err.message);
    res.status(404).json({ error: "User not found" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await updateUser(req.user.id, {
      name,
      avatar,
    });

    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(400).json({ error: "Profile update failed" });
  }
};
