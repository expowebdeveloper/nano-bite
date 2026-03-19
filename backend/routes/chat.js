import express from "express";
import authenticate from "../middlewares/restrict.js";
import { chatController } from "../controllers/chat.js";

const router = express.Router();

router.get("/messages", authenticate, chatController.getMessageHistory);
router.get("/partners", authenticate, chatController.getChatPartners);

export default router;
