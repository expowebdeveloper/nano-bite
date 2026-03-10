import { Router } from "express";
import { listDesigners, listAllUsers } from "../controllers/user.js";
import authenticate from "../middlewares/restrict.js";
import { requireAdmin } from "../middlewares/authorizeAdmin.js";
import { requireAdminOrQc } from "../middlewares/requireAdminOrQc.js";

const router = Router();

router.get("/list", authenticate, requireAdmin, listAllUsers);

router.get(
  "/designers",
  authenticate,
  requireAdminOrQc,
  listDesigners
);

export default router;
