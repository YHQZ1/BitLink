import { getUserById, updateUser } from "../services/user.service.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.json(user);
  } catch {
    res.status(404).json({ error: "User not found" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await updateUser(req.user.id, req.body);
    res.json(user);
  } catch {
    res.status(400).json({ error: "Profile update failed" });
  }
};
