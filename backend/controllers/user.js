// import { prisma } from "../prisma";
import { prisma } from "../lib/prisma.js";
import { HIDDEN_SYSTEM_EMAILS } from "../DefaultUser/DefaultUser.js";

export const listAllUsers = async (req, res) => {
  try {
    const rows = await prisma.user.findMany({
      where: {
        isDeleted: false,
        email: { notIn: HIDDEN_SYSTEM_EMAILS },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        first_name: true,
        last_name: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        phone_number: true,
        resetPasswordToken: true,
      },
      orderBy: { createdAt: "desc" },
    });
    const users = rows.map((u) => {
      const { resetPasswordToken, ...rest } = u;
      const accountStatus =
        u.role === "QC"
          ? resetPasswordToken
            ? "Pending setup"
            : "Active"
          : null;
      return { ...rest, accountStatus };
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

export const listDesigners = async (req, res) => {
  try {
    const designers = await prisma.user.findMany({
      where: {
        role: "Designer",
        isActive: true,
        isDeleted: false,
        isEmailVerified: true,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        fullName: true,
        email: true,
      },
    })
     const qcs = await prisma.user.findMany({
      where: {
        role: "QC",
        isActive: true,
        isDeleted: false,
        isEmailVerified: true,
        resetPasswordToken: null,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        fullName: true,
        email: true,
      },
    });

    res.json({ data: {designers, qcs} });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch designers" });
  }
};
