// import { prisma } from "../prisma";
import { prisma } from "../lib/prisma.js";

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
