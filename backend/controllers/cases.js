import crypto from "crypto";
import { stringFields, arrayFields } from "./caseFields.js";
import { prisma } from "../lib/prisma.js";

const allowedCaseTypes = [
  "Single Crown / Onlay / Veneer",
  "Short-span Bridge",
  "Implant Crown / Implant Bridge",
  "Full Arch Implant Fixed",
  "Digital Complete Denture",
  "Partial Denture",
];

const allowedAttachmentTypes = ["stl", "photo", "pdf", "prescription"];

const attachmentTypeLimits = {
  stl: 200 * 1024 * 1024, // 200MB
  photo: 25 * 1024 * 1024, // 25MB
  pdf: 25 * 1024 * 1024, // 25MB
  prescription: 25 * 1024 * 1024, // 25MB
};

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }
  return [];
};

const normalizeAttachments = (value) => {
  if (!Array.isArray(value)) return { attachments: [], errors: [] };

  const errors = [];
  const attachments = value.map((item, index) => {
    const type = typeof item?.type === "string" ? item.type.trim() : "";
    const name = typeof item?.name === "string" ? item.name.trim() : "";
    const mime = typeof item?.mime === "string" ? item.mime.trim() : "";
    const key = typeof item?.key === "string" ? item.key.trim() : "";
    const url = typeof item?.url === "string" ? item.url.trim() : "";
    const size = Number.isFinite(item?.size) ? item.size : null;

    if (!allowedAttachmentTypes.includes(type)) {
      errors.push(`attachments[${index}].type is invalid`);
    }
    if (!name) {
      errors.push(`attachments[${index}].name is required`);
    }
    if (!mime) {
      errors.push(`attachments[${index}].mime is required`);
    }
    if (!key && !url) {
      errors.push(`attachments[${index}].key or url is required`);
    }
    if (size === null || size < 0) {
      errors.push(`attachments[${index}].size is required`);
    } else {
      const limit = attachmentTypeLimits[type] ?? 0;
      if (limit > 0 && size > limit) {
        errors.push(
          `attachments[${index}].size exceeds limit for type ${type}`
        );
      }
    }

    return { type, name, mime, key, url, size };
  });

  return { attachments, errors };
};

const generateCaseId = () => {
  const rand = crypto.randomBytes(4).toString("hex");
  return `CASE-${Date.now()}-${rand}`;
};

const validatePayload = (body) => {
  const errors = [];

  if (hasText(body.caseType) && !allowedCaseTypes.includes(body.caseType)) {
    errors.push("caseType must be one of the supported case types.");
  }

  const requireText = (field, label = field) => {
    if (!hasText(body[field])) {
      errors.push(`${label} is required.`);
    }
  };

  const requireArray = (field, label = field) => {
    if (normalizeArray(body[field]).length === 0) {
      errors.push(`${label} must include at least one option.`);
    }
  };

  requireText("patientName", "patientName");
  requireText("age", "age");
  requireText("dueDate", "dueDate");
  requireText("caseType", "caseType");

  requireArray("sex", "sex");
  requireArray("bruxism", "bruxism");
  requireArray("photos", "photos");
  requireArray("scans", "scans");

  if (body.caseType === "Single Crown / Onlay / Veneer") {
    requireText("toothType", "toothType");
    requireArray("restorationTypes", "restorationTypes");
    requireArray("materialOptions", "materialOptions");
    requireArray("restorationPrep", "restorationPrep");
    requireArray("contacts", "contacts");
    requireArray("occlusion", "occlusion");
    requireArray("requiredScans", "requiredScans");
  }

  const { errors: attachmentErrors } = normalizeAttachments(body.attachments);
  errors.push(...attachmentErrors);

  return errors;
};

const createCase = async (req, res) => {
  try {
    const errors = validatePayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    const payload = {};

    stringFields.forEach((field) => {
      payload[field] = normalizeString(req.body[field]);
    });

    arrayFields.forEach((field) => {
      payload[field] = normalizeArray(req.body[field]);
    });

    const { attachments } = normalizeAttachments(req.body.attachments);
    payload.attachments = attachments;
    payload.caseId = generateCaseId();
    payload.status = "Submitted";
    payload.createdById = req.user?.data?.id ?? null;

    const dentalCase = await prisma.caseRecord.create({
      data: payload,
    });

    res.status(201).json({
      success: true,
      message: "Case created successfully.",
      data: dentalCase,
    });
  } catch (error) {
    console.error("Create case error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create case.",
      error: error.message,
    });
  }
};

export const casesController = {
  createCase,
  listCases: async (req, res) => {
    try {
      const cases = await prisma.caseRecord.findMany({
        where: {
          createdById: req.user?.data?.id ?? undefined,
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({
        success: true,
        data: cases,
      });
    } catch (error) {
      console.error("List cases error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to fetch cases.",
        error: error.message,
      });
    }
  },
  getCase: async (req, res) => {
    try {
      const { caseId } = req.params;
      if (!caseId) {
        return res.status(400).json({
          success: false,
          message: "caseId is required",
        });
      }

      const record = await prisma.caseRecord.findUnique({
        where: { caseId },
      });

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Case not found.",
        });
      }

      if (req.user?.data?.id && record.createdById && record.createdById !== req.user.data.id) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      res.status(200).json({
        success: true,
        data: record,
      });
    } catch (error) {
      console.error("Get case error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to fetch case.",
        error: error.message,
      });
    }
  },
};

