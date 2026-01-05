import express from "express";
import authenticate from "../middlewares/restrict.js";
import uploadController from "../controllers/uploads.js";

const router = express.Router();

// Generate presigned URL for uploads (STL, photos, PDFs, prescription)
router.post("/presign", authenticate, uploadController.presign);
router.post("/presign/get", authenticate, uploadController.presignGet);

export default router;
