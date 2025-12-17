import { prisma } from "../lib/prisma.js";

const stringFields = [
  "patientName",
  "age",
  "dueDate",
  "estheticNotes",
  "additionalNotes",
  "caseType",
  "toothType",
  "finalShade",
  "stumpShade",
  "noted",
  "abutmentsLeft",
  "abutmentsRight",
  "ponticTeeth",
  "implantBrand",
  "implantPlatform",
  "implantConnection",
  "implantTooth",
  "digitalShade",
  "digitalNewRecord",
  "digitalChanges",
  "partialMajorConnector",
  "partialRests",
  "partialShade",
  "partialClasps",
  "partialBaseAreas",
];

const arrayFields = [
  "sex",
  "bruxism",
  "smileStyle",
  "midline",
  "photos",
  "scans",
  "restorationTypes",
  "materialOptions",
  "restorationPrep",
  "contacts",
  "occlusion",
  "requiredScans",
  "ponticDesign",
  "ponticContacts",
  "bridgeMaterial",
  "bridgeRequiredScans",
  "implantRestoration",
  "implantEmergence",
  "implantRequiredScans",
  "implantAbutment",
  "implantOcclusion",
  "implantAllowed",
  "fullArchDesign",
  "fullArchFramework",
  "fullArchVdo",
  "fullArchOcc",
  "fullArchToothSize",
  "fullArchGingiva",
  "fullArchMidline",
  "fullArchRequiredScansTop",
  "fullArchRequiredScans",
  "digitalType",
  "digitalArch",
  "digitalVdo",
  "digitalToothSetup",
  "digitalBase",
  "digitalCopy",
  "digitalRequiredScans",
  "partialType",
  "partialFramework",
  "partialAesthetics",
  "partialRequiredScans",
];

const normalizeString = (value) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

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

const createCase = async (req, res) => {
  try {
    const payload = {};

    stringFields.forEach((field) => {
      payload[field] = normalizeString(req.body[field]);
    });

    arrayFields.forEach((field) => {
      payload[field] = normalizeArray(req.body[field]);
    });

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
};

