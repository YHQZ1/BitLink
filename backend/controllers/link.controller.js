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
  } catch {
    res.status(400).json({ error: "Failed to create link" });
  }
};

export const createGuestLinkController = async (req, res) => {
  try {
    const link = await createGuestLink(req.body);
    res.status(201).json(link);
  } catch {
    res.status(400).json({ error: "Failed to create guest link" });
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

export const redirectToOriginal = async (req, res) => {
  try {
    const url = await resolveRedirect(req.params.code, req);
    res.redirect(url);
  } catch {
    res.status(404).json({ error: "Link not found" });
  }
};
