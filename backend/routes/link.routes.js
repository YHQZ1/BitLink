import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createLink,
  createGuestLinkController,
  getLinks,
  updateLink,
  deleteLink,
  migrateGuestLinksController,
  redirectToOriginal,
} from "../controllers/link.controller.js";

const router = Router();

router.post("/guest/shorten", createGuestLinkController);
router.get("/r/:code", redirectToOriginal);

router.use(protect);

router.post("/shorten", createLink);
router.get("/me", getLinks);
router.put("/:id", updateLink);
router.delete("/:id", deleteLink);
router.post("/migrate", migrateGuestLinksController);

export default router;
