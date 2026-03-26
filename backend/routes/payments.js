import express from "express";
import authenticate from "../middlewares/restrict.js";
import { requireAdmin } from "../middlewares/authorizeAdmin.js";
import {
  createCheckoutSession,
  getTransactions,
  getBalance,
} from "../controllers/payments.js";

const router = express.Router();

router.post("/create-checkout-session", authenticate, createCheckoutSession);
router.get("/transactions", authenticate, getTransactions);
router.get("/balance", authenticate, getBalance);

export default router;
