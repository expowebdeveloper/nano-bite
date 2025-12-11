import express from "express";
import authenticate from "../middlewares/restrict.js";
import { requireAdmin } from "../middlewares/authorizeAdmin.js";
import { qcController } from "../controllers/qc.js";

const router = express.Router();

router.use(authenticate, requireAdmin);

router.post("/add", qcController.createQcAccount);
router.get("/list", qcController.listQcAccounts);
router.get("/:id", qcController.getQcAccountById);
router.put("/update/:id", qcController.updateQcAccount);
router.delete("/delete/:id", qcController.deleteQcAccount);

export default router;

