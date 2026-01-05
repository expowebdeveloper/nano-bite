import { prisma } from "../lib/prisma.js";

export const requireAdminOrQc = async (req, res, next) => {
  try {
    const userId = req.user?.data?.id;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Missing user context.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "QC")) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Admin or QC can access this resource.",
      });
    }

    req.authenticatedUser = user;
    next();
  } catch (error) {
    console.error("Admin or QC authorization error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

