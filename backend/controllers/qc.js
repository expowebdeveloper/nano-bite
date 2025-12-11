import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import { sendEmail } from "../services/sendEmail.js";
const qcSelect = {
  id: true,
  first_name: true,
  last_name: true,
  fullName: true,
  email: true,
  phone_number: true,
  address: true,
  state: true,
  city: true,
  zipCode: true,
  country: true,
  role: true,
  isActive: true,
  isDeleted: true,
  isEmailVerified: true,
  createdAt: true,
  updatedAt: true,
};

const buildFullName = (firstName, lastName, fallback) => {
  const combined = [firstName, lastName].filter(Boolean).join(" ").trim();
  return combined || fallback || "";
};

const sanitizeString = (value, fallback = "") =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const createQcAccount = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number = "",
      address = "",
      state = "",
      city = "",
      zipCode = "",
      country = "",
      isActive,
    } = req.body;

    if (!first_name || !email) {
      return res.status(400).json({
        success: false,
        message: "first_name and email are required.",
      });
    }

    const placeholderPassword = crypto.randomBytes(12).toString("hex");
    const hashedPassword = await bcrypt.hash(placeholderPassword, 10);
    const resetPasswordToken = crypto.randomBytes(128).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    const qcAccount = await prisma.user.create({
      data: {
        first_name,
        last_name,
        fullName: buildFullName(first_name, last_name, email),
        email,
        phone_number: sanitizeString(phone_number),
        address: sanitizeString(address),
        state: sanitizeString(state),
        city: sanitizeString(city),
        zipCode: sanitizeString(zipCode),
        country: sanitizeString(country),
        password: hashedPassword,
        role: "QC",
        resetPasswordToken,
        resetPasswordExpires,
        ...(typeof isActive === "boolean" ? { isActive } : {}),
      },
      select: qcSelect,
    });

    const recipientName = buildFullName(first_name, last_name, "there");
    const encodedEmail = encodeURIComponent(email);
    const passwordSetupLink = `${process.env.FRONTEND_URL}/set-password?email=${encodedEmail}&challenge=${resetPasswordToken}`;

    await sendEmail({
      to: email,
      subject: "Set your QC account password",
      text: `Hi ${recipientName},

An administrator has created a QC account for you on NanoBite.
Please set your password using the link below:
${passwordSetupLink}

If you were not expecting this email, you can safely ignore it.`,
      html: `
        <p>Hi ${recipientName},</p>
        <p>An administrator has created a QC account for you on NanoBite.</p>
        <p>Please click the link below to set your password and access your account:</p>
        <p><a href="${passwordSetupLink}">${passwordSetupLink}</a></p>
        <p>If you were not expecting this email, you can safely ignore it.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "QC account created successfully. Password setup instructions were emailed to the user.",
      data: qcAccount,
    });
  } catch (error) {
    console.error("Create QC account error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A QC account with this email already exists.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const listQcAccounts = async (_req, res) => {
  try {
    const qcAccounts = await prisma.user.findMany({
      where: { role: "QC", isDeleted: false },
      orderBy: { createdAt: "desc" },
      select: qcSelect,
    });

    res.status(200).json({
      success: true,
      data: qcAccounts,
    });
  } catch (error) {
    console.error("List QC accounts error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getQcAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid QC account id.",
      });
    }

    const qcAccount = await prisma.user.findFirst({
      where: { id, role: "QC", isDeleted: false },
      select: qcSelect,
    });

    if (!qcAccount) {
      return res.status(404).json({
        success: false,
        message: "QC account not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: qcAccount,
    });
  } catch (error) {
    console.error("Get QC account error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const updateQcAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid QC account id.",
      });
    }

    const existingQc = await prisma.user.findFirst({
      where: { id, role: "QC", isDeleted: false },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        fullName: true,
        email: true,
      },
    });

    if (!existingQc) {
      return res.status(404).json({
        success: false,
        message: "QC account not found.",
      });
    }

    const {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      state,
      city,
      zipCode,
      country,
      password,
      isActive,
      isDeleted,
    } = req.body;

    const updateData = {};

    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email !== undefined) updateData.email = email;
    if (phone_number !== undefined) updateData.phone_number = sanitizeString(phone_number);
    if (address !== undefined) updateData.address = sanitizeString(address);
    if (state !== undefined) updateData.state = sanitizeString(state);
    if (city !== undefined) updateData.city = sanitizeString(city);
    if (zipCode !== undefined) updateData.zipCode = sanitizeString(zipCode);
    if (country !== undefined) updateData.country = sanitizeString(country);

    if (first_name !== undefined || last_name !== undefined) {
      const nextFirst = first_name ?? existingQc.first_name ?? "";
      const nextLast = last_name ?? existingQc.last_name ?? "";
      updateData.fullName = buildFullName(
        nextFirst,
        nextLast,
        existingQc.fullName || existingQc.email
      );
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (typeof isDeleted === "boolean") updateData.isDeleted = isDeleted;

    updateData.role = "QC";

    const updatedQc = await prisma.user.update({
      where: { id },
      data: updateData,
      select: qcSelect,
    });

    res.status(200).json({
      success: true,
      message: "QC account updated successfully.",
      data: updatedQc,
    });
  } catch (error) {
    console.error("Update QC account error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A QC account with this email already exists.",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "QC account not found.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const deleteQcAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid QC account id.",
      });
    }

    const existingQc = await prisma.user.findFirst({
      where: { id, role: "QC", isDeleted: false },
      select: { id: true },
    });

    if (!existingQc) {
      return res.status(404).json({
        success: false,
        message: "QC account not found.",
      });
    }

    await prisma.user.update({
      where: { id },
      data: { isDeleted: true, isActive: false },
    });

    res.status(200).json({
      success: true,
      message: "QC account deleted successfully.",
    });
  } catch (error) {
    console.error("Delete QC account error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "QC account not found.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const qcController = {
  createQcAccount,
  listQcAccounts,
  getQcAccountById,
  updateQcAccount,
  deleteQcAccount,
};

