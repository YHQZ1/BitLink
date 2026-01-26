import {
  createUserLink,
  createGuestLink,
  getUserLinks,
  updateUserLink,
  deleteUserLink,
  migrateGuestLinks,
  resolveRedirect,
} from "../services/link.service.js";

export const createLink = async (req, res) => {
  try {
    const link = await createUserLink(req.user.id, req.body);
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({
      error: err.message || "Failed to create link",
    });
  }
};

export const createGuestLinkController = async (req, res) => {
  try {
    const link = await createGuestLink(req.body);
    res.status(201).json({ data: link });
  } catch (err) {
    const map = {
      NO_URL: { status: 400, message: "No URL provided" },
      INVALID_URL: { status: 400, message: "Invalid URL format" },
      INVALID_SESSION: { status: 400, message: "Invalid guest session" },
      GUEST_LIMIT: { status: 429, message: "Guest limit reached" },
      ALIAS_TAKEN: { status: 409, message: "Custom alias already taken" },
    };

    const error = map[err.message] || {
      status: 400,
      message: "Failed to create guest link",
    };

    res.status(error.status).json({
      error: error.message,
      code: err.message || "UNKNOWN_ERROR",
    });
  }
};

export const getLinks = async (req, res) => {
  try {
    const links = await getUserLinks(req.user.id);
    res.json(links);
  } catch {
    res.status(400).json({ error: "Failed to fetch links" });
  }
};

export const updateLink = async (req, res) => {
  try {
    const link = await updateUserLink(req.user.id, req.params.id, req.body);
    res.json(link);
  } catch {
    res.status(400).json({ error: "Failed to update link" });
  }
};

export const deleteLink = async (req, res) => {
  try {
    await deleteUserLink(req.user.id, req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Failed to delete link" });
  }
};

export const migrateGuestLinksController = async (req, res) => {
  try {
    const result = await migrateGuestLinks(req.user.id, req.body.sessionId);
    res.json(result);
  } catch {
    res.status(400).json({ error: "Migration failed" });
  }
};

export const redirectToOriginal = async (req, res, next) => {
  const url = await resolveRedirect(req.params.code, req);
  return res.redirect(302, url);
};
