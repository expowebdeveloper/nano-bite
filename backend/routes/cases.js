import express from "express";
import authenticate from "../middlewares/restrict.js";
import { casesController } from "../controllers/cases.js";

const router = express.Router();

router.post("/", authenticate, casesController.createCase);
router.get("/", authenticate, casesController.listCases);
router.get("/:caseId", authenticate, casesController.getCase);

export default router;

