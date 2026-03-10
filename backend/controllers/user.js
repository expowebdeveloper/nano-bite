// import { prisma } from "../prisma";
import { prisma } from "../lib/prisma.js";

export const listAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
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
      },
      orderBy: { createdAt: "desc" },
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
