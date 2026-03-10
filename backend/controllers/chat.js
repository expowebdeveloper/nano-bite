import { prisma } from "../lib/prisma.js";

/** Build a consistent DM room id from two user ids (order-independent). */
export function getDmRoomId(userId1, userId2) {
  if (!userId1 || !userId2) return null;
  const [a, b] = [userId1, userId2].sort();
  return `dm_${a}_${b}`;
}

export const chatController = {
  getMessageHistory: async (req, res) => {
    try {
      const limit = Math.min(100, parseInt(req.query.limit, 10) || 50);
      const before = req.query.before;
      const roomId = (req.query.roomId || "").trim();

      if (!roomId) {
        return res.status(400).json({
          success: false,
          message: "roomId is required",
        });
      }

      const currentUserId = req.user?.data?.id;
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const prefix = "dm_";
      const parts = roomId.startsWith(prefix) ? roomId.slice(prefix.length).split("_") : [];
      const userIds = parts.length >= 2 ? [parts[0], parts[1]] : [];
      if (userIds.length < 2 || !userIds.includes(currentUserId)) {
        return res.status(403).json({ success: false, message: "Access denied to this room" });
      }

      const where = { roomId };
      if (before) {
        const beforeMsg = await prisma.chatMessage.findUnique({
          where: { id: before },
        });
        if (beforeMsg) {
          where.createdAt = { lt: beforeMsg.createdAt };
        }
      }

      const messages = await prisma.chatMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      const ordered = messages.reverse();
      res.status(200).json({
        success: true,
        data: ordered,
      });
    } catch (error) {
      console.error("Get chat history error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load messages",
        error: error.message,
      });
    }
  },

  getChatPartners: async (req, res) => {
    try {
      const currentUserId = req.user?.data?.id;
      if (!currentUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const me = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true },
      });
      if (!me || (me.role !== "ADMIN" && me.role !== "QC")) {
        return res.status(403).json({ success: false, message: "Only Admin and QC can use chat" });
      }

      const where = {
        isDeleted: false,
        isActive: true,
        id: { not: currentUserId },
      };
      if (me.role === "ADMIN") {
        where.role = "QC";
      } else {
        where.role = "ADMIN";
      }

      const partners = await prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
        },
        orderBy: { fullName: "asc" },
      });

      res.status(200).json({ success: true, data: partners });
    } catch (error) {
      console.error("Get chat partners error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch chat partners",
        error: error.message,
      });
    }
  },
};
