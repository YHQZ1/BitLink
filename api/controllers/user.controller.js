import {
  getUserById,
  updateUser,
  deleteUser,
} from "../services/user.service.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);

    res.json(user);
  } catch (err) {
    console.error("Error retrieving current user:", err.message);
    next(err);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await updateUser(req.user.id, {
      name,
      avatar,
    });

    res.json(user);
  } catch (err) {
    console.error("Error updating user profile:", err.message);
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await deleteUser(req.user.id);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting account:", err.message);
    next(err);
  }
};
