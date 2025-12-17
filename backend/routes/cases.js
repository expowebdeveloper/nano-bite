import express from "express";
import authenticate from "../middlewares/restrict.js";
import { casesController } from "../controllers/cases.js";

const router = express.Router();

router.post("/", authenticate, casesController.createCase);

export default router;

