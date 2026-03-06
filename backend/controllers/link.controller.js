import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import {
  createUserLink,
  createGuestLink,
  getUserLinks,
  updateUserLink,
  deleteUserLink,
  migrateGuestLinks,
  resolveRedirect,
} from "../services/link.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notFoundTemplate = fs.readFileSync(
  path.join(__dirname, "..", "public", "link-not-found.html"),
  "utf-8",
);

export const createLink = async (req, res) => {
  try {
    const link = await createUserLink(req.user.id, req.body);
    res.status(201).json(link);
  } catch (err) {
    console.error("Create link error:", err.message);
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
  } catch (err) {
    console.error("Fetch links error:", err.message);
    res.status(400).json({ error: "Failed to fetch links" });
  }
};

export const updateLink = async (req, res) => {
  try {
    const link = await updateUserLink(req.user.id, req.params.id, req.body);
    res.json(link);
  } catch (err) {
    console.error("Update link error:", err.message);
    res.status(400).json({ error: "Failed to update link" });
  }
};

export const deleteLink = async (req, res) => {
  try {
    await deleteUserLink(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error("Delete link error:", err.message);
    res.status(400).json({ error: "Failed to delete link" });
  }
};

export const migrateGuestLinksController = async (req, res) => {
  try {
    const result = await migrateGuestLinks(req.user.id, req.body.sessionId);
    res.json(result);
  } catch (err) {
    console.error("Guest migration error:", err.message);
    res.status(400).json({ error: "Migration failed" });
  }
};

export const redirectToOriginal = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).send("Invalid link");
    }

    const url = await resolveRedirect(code, req);
    return res.redirect(302, url);
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      const html = notFoundTemplate.replace(
        "{{CLIENT_URL}}",
        process.env.CLIENT_URL || "http://localhost:3000",
      );

      return res.status(404).send(html);
    }

    console.error("Redirect failure:", err);
    return res.status(500).send("Internal Server Error");
  }
};
