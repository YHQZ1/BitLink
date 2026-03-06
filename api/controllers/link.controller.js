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

export const createLink = async (req, res, next) => {
  try {
    const link = await createUserLink(req.user.id, req.body);

    res.status(201).json(link);
  } catch (err) {
    console.error("Error creating link:", err.message);
    next(err);
  }
};

export const createGuestLinkController = async (req, res, next) => {
  try {
    const link = await createGuestLink(req.body);

    res.status(201).json(link);
  } catch (err) {
    console.error("Error creating guest link:", err.message);
    next(err);
  }
};

export const getLinks = async (req, res, next) => {
  try {
    const links = await getUserLinks(req.user.id);

    res.json(links);
  } catch (err) {
    console.error("Error retrieving links:", err.message);
    next(err);
  }
};

export const updateLink = async (req, res, next) => {
  try {
    const link = await updateUserLink(req.user.id, req.params.id, req.body);

    res.json(link);
  } catch (err) {
    console.error("Error updating link:", err.message);
    next(err);
  }
};

export const deleteLink = async (req, res, next) => {
  try {
    await deleteUserLink(req.user.id, req.params.id);

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting link:", err.message);
    next(err);
  }
};

export const migrateGuestLinksController = async (req, res, next) => {
  try {
    const result = await migrateGuestLinks(req.user.id, req.body.sessionId);

    res.json(result);
  } catch (err) {
    console.error("Error migrating guest links:", err.message);
    next(err);
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

    console.error("Redirect error:", err);

    return res.status(500).send("Something went wrong while redirecting.");
  }
};
