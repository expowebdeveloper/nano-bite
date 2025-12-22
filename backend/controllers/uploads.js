import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const allowedAttachmentTypes = ["stl", "photo", "pdf", "prescription"];

const attachmentTypeLimits = {
  stl: 200 * 1024 * 1024, // 200MB
  photo: 25 * 1024 * 1024, // 25MB
  pdf: 25 * 1024 * 1024, // 25MB
  prescription: 25 * 1024 * 1024, // 25MB
};

const requiredEnv = ["AWS_REGION", "AWS_S3_BUCKET"];

const checkEnv = () => {
  const missing = requiredEnv.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required AWS config: ${missing.join(", ")}`);
  }
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  // Credentials are picked up from env/instance profile by default.
});

const generateKey = (fileName, userId, fileCategory) => {
  const safeName = typeof fileName === "string" ? fileName.replace(/\s+/g, "_") : "file";
  const rand = crypto.randomBytes(4).toString("hex");
  const owner = userId ?? "anonymous";

  const basePrefix = (() => {
    const defaultPrefix = "uploads";
    const globalPrefix = process.env.AWS_S3_UPLOAD_PREFIX || defaultPrefix;
    if (fileCategory === "stl") {
      return process.env.AWS_S3_STL_PREFIX || globalPrefix;
    }
    return globalPrefix;
  })();

  const prefix = basePrefix.replace(/\/+$/, ""); // avoid trailing slash dupes

  return `${prefix}/${owner}/${Date.now()}-${rand}-${safeName}`;
};

const parseSize = (value) => {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : null;
};

const uploadController = {
  presign: async (req, res) => {
    try {
      checkEnv();

      const { fileName, fileType, fileCategory, contentLength } = req.body || {};

      if (!fileName) {
        return res.status(400).json({ success: false, message: "fileName is required" });
      }
      if (!fileType) {
        return res.status(400).json({ success: false, message: "fileType is required" });
      }
      if (!allowedAttachmentTypes.includes(fileCategory)) {
        return res.status(400).json({
          success: false,
          message: `fileCategory must be one of: ${allowedAttachmentTypes.join(", ")}`,
        });
      }

      const size = parseSize(contentLength);
      const sizeLimit = attachmentTypeLimits[fileCategory] ?? 0;
      if (size === null) {
        return res.status(400).json({ success: false, message: "contentLength is required" });
      }
      if (sizeLimit > 0 && size > sizeLimit) {
        return res.status(400).json({
          success: false,
          message: `File size exceeds limit for ${fileCategory}`,
        });
      }

      const key = generateKey(fileName, req.user?.data?.id, fileCategory);

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        ContentType: fileType,
        ContentLength: size,
      });

      const expiresIn = Number(process.env.S3_PRESIGN_EXPIRES ?? 900); // 15 minutes default
      const url = await getSignedUrl(s3Client, command, { expiresIn });

      return res.status(200).json({
        success: true,
        data: {
          url,
          key,
          expiresIn,
          bucket: process.env.AWS_S3_BUCKET,
        },
      });
    } catch (error) {
      console.error("Presign error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to generate upload URL",
        error: error.message,
      });
    }
  },
  presignGet: async (req, res) => {
    try {
      checkEnv();
      const { key } = req.body || {};

      if (!key || typeof key !== "string") {
        return res.status(400).json({ success: false, message: "key is required" });
      }

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      });

      const expiresIn = Number(process.env.S3_PRESIGN_EXPIRES ?? 900);
      const url = await getSignedUrl(s3Client, command, { expiresIn });

      return res.status(200).json({
        success: true,
        data: { url, expiresIn, key },
      });
    } catch (error) {
      console.error("Presign GET error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to generate download URL",
        error: error.message,
      });
    }
  },
};

export default uploadController;


