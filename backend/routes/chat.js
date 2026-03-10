import express from "express";
import authenticate from "../middlewares/restrict.js";
import { requireAdminOrQc } from "../middlewares/requireAdminOrQc.js";
import { chatController } from "../controllers/chat.js";

const router = express.Router();

router.get(
  "/messages",
  authenticate,
  requireAdminOrQc,
  chatController.getMessageHistory
);

router.get(
  "/partners",
  authenticate,
  requireAdminOrQc,
  chatController.getChatPartners
);

export default router;
