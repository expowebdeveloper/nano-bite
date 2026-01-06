import express from "express";
import authenticate from "../middlewares/restrict.js";
import { casesController } from "../controllers/cases.js";
import { requireAdmin } from "../middlewares/authorizeAdmin.js";
import { requireQc } from "../middlewares/authorizeQc.js";
import { requireAdminOrQc } from "../middlewares/requireAdminOrQc.js";

const router = express.Router();



router.post("/", authenticate, casesController.createCase);
router.post(
  "/designer-attachments",
  authenticate,
  casesController.uploadDesignerAttachments
);
router.get(
  "/:caseId/designer-attachments",
  authenticate,casesController.
  getDesignerAttachments
);

router.post("/:caseId/assign",authenticate,requireAdminOrQc, casesController.assignCaseToDesigner
);
router.get("/", authenticate, casesController.listCases);
router.get("/admin/all", authenticate,requireAdminOrQc, casesController.listAllCasesForAdmin);
router.get("/designer", authenticate, casesController.listCasesForDesigner);
router.get("/:caseId", authenticate, casesController.getCase);
router.patch("/:caseId/status", authenticate, casesController.updateCaseStatus);



export default router;