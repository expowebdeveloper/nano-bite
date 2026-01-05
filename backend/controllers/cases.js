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
        lastUpdatedAt: new Date(),
        lastUpdatedBy: designerId,
      },
    });

    // Create activity log (optional but recommended)
    await prisma.activityLog.create({
      data: {
        caseId: caseId,
        action: "DESIGNER_UPLOAD",
        description: `Designer uploaded ${normalizedAttachments.length} attachment(s)`,
        performedBy: designerId,
        metadata: {
          attachmentCount: normalizedAttachments.length,
          attachmentNames: normalizedAttachments.map((a) => a.name),
        },
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


    listAllCasesForAdmin: async (req, res) => {
    try {
      const cases = await prisma.caseRecord.findMany({
        orderBy: { createdAt: "desc" },
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


      });

      res.status(200).json({
        success: true,
        data: cases,
      });designerAttachmentsQuery
    } catch (error) {
      console.error("Admin list cases error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to fetch all cases.",
        error: error.message,
      });
    }
  },
listCasesForDesigner: async (req, res) => {
  console.log("Fetching cases for designer:", req.user);
  try {
    const designerId = req.user.data.id; // from JWT
    
    // console.log("Designer ID:", req.user.data.id);

    const cases = await prisma.caseRecord.findMany({
      where: {
        assignedToDesignerId: designerId,
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    return res.json({
      success: true,
      data: cases,
    });
  } catch (error) {
    console.error("Get designer cases error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch designer cases",
    });
  }}

  ,
assignCaseToDesigner: async (req, res) => {
  try {
    const { caseId } = req.params;
    const { designerId,qcId} = req.body;

    const assignedById = req.user.data.id; // ADMIN / QC

    if (!designerId ) {
      return res.status(400).json({ message: "Designer ID is required" });
    }
    if (!qcId ) {
      return res.status(400).json({ message: "Designer ID is required" });
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

updateCaseStatus:async(req,res)=>{
  try{
 const { caseId } = req.params;
 const { status } = req.body;
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
      },})
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

  }catch(error){ }

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
};

