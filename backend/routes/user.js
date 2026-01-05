import { Router } from "express";
import { listDesigners } from "../controllers/user.js";
import authenticate from "../middlewares/restrict.js";

import { requireAdminOrQc } from "../middlewares/requireAdminOrQc.js";

const router = Router();

router.get(
  "/designers",
  authenticate,
  requireAdminOrQc,
  listDesigners
);

export default router;
