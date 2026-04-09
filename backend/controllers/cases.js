import crypto from "crypto";
import { stringFields, arrayFields, numberArrayFields } from "./caseFields.js";
import { prisma } from "../lib/prisma.js";

const allowedCaseTypes = [
  "Single Crown / Onlay / Veneer",
  "Short-span Bridge",
  "Implant Crown / Implant Bridge",
  "Full Arch Implant Fixed",
  "Digital Complete Denture",
  "Partial Denture",
];

const allowedAttachmentTypes = ["stl", "photo", "pdf", "prescription", "archive"];

const FIVE_HUNDRED_MB = 500 * 1024 * 1024;
const attachmentTypeLimits = {
  stl: FIVE_HUNDRED_MB,
  photo: FIVE_HUNDRED_MB,
  pdf: FIVE_HUNDRED_MB,
  prescription: FIVE_HUNDRED_MB,
  archive: FIVE_HUNDRED_MB,
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

const normalizeNumberArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .filter((item) => typeof item === "number" || (typeof item === "string" && !isNaN(Number(item))))
      .map((item) => typeof item === "number" ? item : Number(item))
      .filter((item) => !isNaN(item));
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
  } else if (body.caseType === "Short-span Bridge") {
    requireText("abutmentsLeft", "abutmentsLeft");
    requireText("abutmentsRight", "abutmentsRight");
    requireText("ponticTeeth", "ponticTeeth");
    requireArray("ponticDesign", "ponticDesign");
    requireArray("ponticContacts", "ponticContacts");
    requireArray("bridgeMaterial", "bridgeMaterial");
    requireArray("bridgeRequiredScans", "bridgeRequiredScans");
  } else if (body.caseType === "Implant Crown / Implant Bridge") {
    requireText("implantBrand", "implantBrand");
    requireText("implantPlatform", "implantPlatform");
    requireText("implantConnection", "implantConnection");
    // requireText("implantTooth", "implantTooth");
    // requireArray("implantRestoration", "implantRestoration"); // optional or handle logic
    // requireArray("implantEmergence", "implantEmergence");
    // requireArray("implantRequiredScans", "implantRequiredScans");
    // requireArray("implantAbutment", "implantAbutment");
    // requireArray("implantOcclusion", "implantOcclusion");
  } else if (body.caseType === "Full Arch Implant Fixed") {
    // Add validations for Full Arch Implant Fixed if needed
  } else if (body.caseType === "Digital Complete Denture") {
    // Digital Complete Denture / Denture-specific validations can be added here if needed
  } else if (body.caseType === "Partial Denture") {
    // Add validations for Partial Denture if needed
  }

  const { errors: attachmentErrors } = normalizeAttachments(body.attachments);
  errors.push(...attachmentErrors);

  return errors;
};

const createCase = async (req, res) => {
  try {
    const userId = req.user?.data?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in again.",
      });
    }

    const creator = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!creator) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

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

    numberArrayFields.forEach((field) => {
      payload[field] = normalizeNumberArray(req.body[field]);
    });

    // Map boolean fields directly without string/array normalization
    const booleanFields = [
      "hasExistingDenture",
      "isExactCopy",
      "isImplantSupported",
      "dentureWantsAddOns",
      "dentureHasDiastema",
      "dentureWantsDesignPreview",
      "partialIsReplacement",
      "overdentureUseSameImplantSystem",
    ];

    booleanFields.forEach((field) => {
      if (typeof req.body[field] === "boolean") {
        payload[field] = req.body[field];
      }
    });

    const { attachments } = normalizeAttachments(req.body.attachments);
    payload.attachments = attachments;
    payload.caseId = generateCaseId();
    payload.status = "Submitted";
    payload.createdById = creator.id;
    payload.cloudFolderLink = normalizeString(req.body.cloudFolderLink);

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

const getDesignerAttachments = async (req, res) => {
  try {
    const { caseId } = req.params;

    if (!caseId) {
      return res.status(400).json({
        success: false,
        message: "caseId is required",
      });
    }

    const caseRecord = await prisma.caseRecord.findUnique({
      where: { caseId },
      select: {
        caseId: true,
        patientName: true,
        designersAttachments: true,
        status: true,
      },
    });

    if (!caseRecord) {
      return res.status(404).json({
        success: false,
        message: "Case not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        caseId: caseRecord.caseId,
        patientName: caseRecord.patientName,
        status: caseRecord.status,
        designersAttachments: caseRecord.designersAttachments || [],
        attachmentCount: (caseRecord.designersAttachments || []).length,
      },
    });
  } catch (error) {
    console.error("Get designer attachments error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve attachments.",
      error: error.message,
    });
  }
};

const uploadDesignerAttachments = async (req, res) => {
  try {
    const { caseId, attachments, designerId } = req.body;

    // Validation
    const errors = [];

    if (!caseId) {
      errors.push("caseId is required");
    }

    if (!designerId) {
      errors.push("designerId is required");
    }

    if (!attachments || !Array.isArray(attachments) || attachments.length === 0) {
      errors.push("At least one attachment is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    // Check if case exists
    const existingCase = await prisma.caseRecord.findUnique({
      where: { caseId },
    });

    if (!existingCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found.",
      });
    }

    // Normalize and validate attachments
    const { attachments: normalizedAttachments } = normalizeAttachments(attachments);

    if (normalizedAttachments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid attachments to upload.",
      });
    }

    // Add metadata to each attachment
    const attachmentsWithMetadata = normalizedAttachments.map((att) => ({
      ...att,
      uploadedAt: new Date().toISOString(),
      uploadedBy: designerId,
    }));

    // Get existing designer attachments or initialize empty array
    const existingDesignerAttachments = existingCase.designersAttachments || [];

    // Merge new attachments with existing ones
    const updatedDesignerAttachments = [
      ...existingDesignerAttachments,
      ...attachmentsWithMetadata,
    ];

    // Update the case with new designer attachments
    const updatedCase = await prisma.caseRecord.update({
      where: { caseId },
      data: {
        designersAttachments: updatedDesignerAttachments,
      },
    });

    res.status(200).json({
      success: true,
      message: `Successfully uploaded ${normalizedAttachments.length} attachment(s).`,
      data: {
        caseId: updatedCase.caseId,
        designersAttachments: updatedCase.designersAttachments,
        totalAttachments: updatedDesignerAttachments.length,
      },
    });
  } catch (error) {
    console.error("Upload designer attachments error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to upload attachments.",
      error: error.message,
    });
  }
}

export const casesController = {
  createCase,
  getDesignerAttachments,
  uploadDesignerAttachments,
  listCases: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
      const search = (req.query.search || "").trim().toLowerCase();
      const skip = (page - 1) * limit;

      const where = { createdById: req.user?.data?.id ?? undefined };
      if (search) {
        where.OR = [
          { caseId: { contains: search, mode: "insensitive" } },
          { patientName: { contains: search, mode: "insensitive" } },
          { caseType: { contains: search, mode: "insensitive" } },
          { status: { contains: search, mode: "insensitive" } },
        ];
      }

      const [cases, total] = await Promise.all([
        prisma.caseRecord.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          include: {
            createdBy: {
              select: { id: true, fullName: true, email: true, role: true },
            },
          },
        }),
        prisma.caseRecord.count({ where }),
      ]);

      const [submittedCount, inDesignCount, completedCount] = await Promise.all([
        prisma.caseRecord.count({ where: { ...where, status: "Submitted" } }),
        prisma.caseRecord.count({ where: { ...where, status: "In Design" } }),
        prisma.caseRecord.count({ where: { ...where, status: "Completed" } }),
      ]);
      res.status(200).json({
        success: true,
        data: cases,
        total,
        submittedCount,
        inDesignCount,
        completedCount,
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


  listAllCasesForAdmin: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
      const search = (req.query.search || "").trim().toLowerCase();
      const skip = (page - 1) * limit;

      const where = {};
      if (search) {
        where.OR = [
          { caseId: { contains: search, mode: "insensitive" } },
          { patientName: { contains: search, mode: "insensitive" } },
          { caseType: { contains: search, mode: "insensitive" } },
          { status: { contains: search, mode: "insensitive" } },
        ];
      }

      const [cases, total] = await Promise.all([
        prisma.caseRecord.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          include: {
            assignedToDesigner: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
              },
            },
            assignedToQc: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
              },
            },
            assignedBy: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
              },
            },
          },
        }),
        prisma.caseRecord.count({ where }),
      ]);

      const [submittedCount, inDesignCount, completedCount] = await Promise.all([
        prisma.caseRecord.count({ where: { ...where, status: "Submitted" } }),
        prisma.caseRecord.count({ where: { ...where, status: "In Design" } }),
        prisma.caseRecord.count({ where: { ...where, status: "Completed" } }),
      ]);
      res.status(200).json({
        success: true,
        data: cases,
        total,
        submittedCount,
        inDesignCount,
        completedCount,
      });
    } catch (error) {
      console.error("Admin list cases error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to fetch all cases.",
        error: error.message,
      });
    }
  },
  getCalendarCases: async (req, res) => {
    try {
      const userId = req.user?.data?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const me = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (!me) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      const year = parseInt(req.query.year, 10) || new Date().getFullYear();
      const month = parseInt(req.query.month, 10);
      if (!month || month < 1 || month > 12) {
        return res.status(400).json({ success: false, message: "Valid month (1-12) required" });
      }
      const lastDay = new Date(year, month, 0).getDate();
      const start = `${year}-${String(month).padStart(2, "0")}-01`;
      const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

      let where = {};
      if (me.role === "ADMIN") {
        where = {};
      } else if (me.role === "QC") {
        where = { assignedToQcId: userId };
      } else if (me.role === "Designer") {
        where = { assignedToDesignerId: userId };
      } else {
        where = { createdById: userId };
      }
      where.dueDate = { gte: start, lte: end };

      const cases = await prisma.caseRecord.findMany({
        where,
        select: { caseId: true, dueDate: true, patientName: true, status: true, caseType: true },
        orderBy: { dueDate: "asc" },
      });
      res.status(200).json({ success: true, data: cases });
    } catch (error) {
      console.error("Calendar cases error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch calendar cases", error: error.message });
    }
  },

  listCasesForQc: async (req, res) => {
    try {
      const qcId = req.user.data.id;
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
      const search = (req.query.search || "").trim().toLowerCase();
      const skip = (page - 1) * limit;

      const where = { assignedToQcId: qcId };
      if (search) {
        where.OR = [
          { caseId: { contains: search, mode: "insensitive" } },
          { patientName: { contains: search, mode: "insensitive" } },
          { caseType: { contains: search, mode: "insensitive" } },
          { status: { contains: search, mode: "insensitive" } },
        ];
      }

      const [cases, total] = await Promise.all([
        prisma.caseRecord.findMany({
          where,
          orderBy: { assignedAt: "desc" },
          skip,
          take: limit,
          include: {
            createdBy: {
              select: { id: true, fullName: true, email: true, role: true },
            },
          },
        }),
        prisma.caseRecord.count({ where }),
      ]);

      const [submittedCount, inDesignCount, completedCount] = await Promise.all([
        prisma.caseRecord.count({ where: { ...where, status: "Submitted" } }),
        prisma.caseRecord.count({ where: { ...where, status: "In Design" } }),
        prisma.caseRecord.count({ where: { ...where, status: "Completed" } }),
      ]);
      return res.json({
        success: true,
        data: cases,
        total,
        submittedCount,
        inDesignCount,
        completedCount,
      });
    } catch (error) {
      console.error("Get QC cases error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch QC cases",
      });
    }
  },

  listCasesForDesigner: async (req, res) => {
    try {
      const designerId = req.user.data.id;
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
      const search = (req.query.search || "").trim().toLowerCase();
      const skip = (page - 1) * limit;

      const where = { assignedToDesignerId: designerId };
      if (search) {
        where.OR = [
          { caseId: { contains: search, mode: "insensitive" } },
          { patientName: { contains: search, mode: "insensitive" } },
          { caseType: { contains: search, mode: "insensitive" } },
          { status: { contains: search, mode: "insensitive" } },
        ];
      }

      const [cases, total] = await Promise.all([
        prisma.caseRecord.findMany({
          where,
          orderBy: { assignedAt: "desc" },
          skip,
          take: limit,
          include: {
            createdBy: {
              select: { id: true, fullName: true, email: true, role: true },
            },
          },
        }),
        prisma.caseRecord.count({ where }),
      ]);

      const [submittedCount, inDesignCount, completedCount] = await Promise.all([
        prisma.caseRecord.count({ where: { ...where, status: "Submitted" } }),
        prisma.caseRecord.count({ where: { ...where, status: "In Design" } }),
        prisma.caseRecord.count({ where: { ...where, status: "Completed" } }),
      ]);
      return res.json({
        success: true,
        data: cases,
        total,
        submittedCount,
        inDesignCount,
        completedCount,
      });
    } catch (error) {
      console.error("Get designer cases error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch designer cases",
      });
    }
  }

  ,
  assignCaseToDesigner: async (req, res) => {
    try {
      const { caseId } = req.params;
      const { designerId, qcId } = req.body;

      const assignedById = req.user.data.id; // ADMIN / QC

      if (!designerId) {
        return res.status(400).json({ message: "Designer ID is required" });
      }
      if (!qcId) {
        return res.status(400).json({ message: "QC ID is required" });
      }

      // 1️ Validate case
      const caseRecord = await prisma.caseRecord.findUnique({
        where: { caseId },
      });

      if (!caseRecord) {
        return res.status(404).json({ message: "Case not found" });
      }

      // 2️ Validate designer
      const designer = await prisma.user.findFirst({
        where: {
          id: designerId,
          role: "Designer",
          isActive: true,
          isDeleted: false,
        },
      });

      if (!designer) {
        return res.status(400).json({ message: "Invalid designer" });
      }
      const qc = await prisma.user.findFirst({
        where: {
          id: qcId,
          role: "QC",
          isActive: true,
          isDeleted: false,
        },
      });

      if (!qc) {
        return res.status(400).json({ message: "Invalid QC" });
      }

      // 3️⃣ Assign case
      const updatedCase = await prisma.caseRecord.update({
        where: { caseId },
        data: {
          assignedToDesignerId: designerId,
          assignedToQcId: qcId,
          assignedById,
          assignedAt: new Date(),
          status: "Assigned",
        },
      });

      return res.json({
        message: "Case assigned to designer successfully",
        data: updatedCase,
      });
    } catch (error) {
      console.error("Assign case error:", error);
      return res.status(500).json({ message: "Failed to assign case" });
    }
  },

  updateCaseStatus: async (req, res) => {
    try {
      const { caseId } = req.params;
      const { status, qcComment } = req.body;
      if (!caseId) {
        return res.status(400).json({
          success: false,
          message: "caseId is required",
        })
      }
      const updatedCase = await prisma.caseRecord.update({
        where: { caseId },
        data: {
          status,
          qcComment: typeof qcComment === "string" ? qcComment : undefined,
        },
      })
      if (!updatedCase) {
        return res.status(404).json({
          success: false,
          message: "Case not found."
        })
      }
      return res.json({
        success: true,
        message: "Case status updated successfully",
        data: updatedCase,
      })

    } catch (error) { }

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
        include: {
          payments: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              invoiceId: true,
              invoiceUrl: true,
              createdAt: true,
            },
          },
        },
      });

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Case not found.",
        });
      }

      // if (req.user?.data?.id && record.createdById 
      //   && record.createdById !== req.user.data.id

      // ) {
      //   return res.status(403).json({
      //     success: false,
      //     message: "Forbidden",
      //   });
      // }

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

  markCasePaid: async (req, res) => {
    try {
      const { caseId } = req.params;
      const userId = req.user?.data?.id;
      if (!caseId || !userId) {
        return res.status(400).json({ success: false, message: "caseId required" });
      }
      const record = await prisma.caseRecord.findUnique({
        where: { caseId },
        select: { id: true, createdById: true, status: true },
      });
      if (!record) {
        return res.status(404).json({ success: false, message: "Case not found" });
      }
      const me = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      const isOwner = record.createdById === userId;
      const isAdmin = me?.role === "ADMIN";
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: "Only case owner or Admin can mark payment" });
      }
      await prisma.caseRecord.update({
        where: { caseId },
        data: { isPaid: true },
      });
      res.status(200).json({ success: true, message: "Case marked as paid" });
    } catch (error) {
      console.error("Mark case paid error:", error);
      res.status(500).json({ success: false, message: "Failed to update payment status" });
    }
  },
};

