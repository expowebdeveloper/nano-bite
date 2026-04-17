import { prisma } from "../lib/prisma.js";
import { HIDDEN_SYSTEM_EMAILS } from "../DefaultUser/DefaultUser.js";

/** Build a consistent DM room id from two user ids (order-independent). */
export function getDmRoomId(userId1, userId2) {
  if (!userId1 || !userId2) return null;
  const [a, b] = [userId1, userId2].sort();
  return `dm_${a}_${b}`;
}

function parseDmRoomId(roomId) {
  if (!roomId || typeof roomId !== "string" || !roomId.startsWith("dm_")) return null;
  const parts = roomId.slice(3).split("_");
  return parts.length >= 2 ? [parts[0], parts[1]] : null;
}

function isDentistDesignerPair(roleA, roleB) {
  const a = roleA || "";
  const b = roleB || "";
  return (
    (a === "Dentist" && b === "Designer") ||
    (a === "Designer" && b === "Dentist")
  );
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

      const userIds = parseDmRoomId(roomId) ?? [];
      if (userIds.length < 2 || !userIds.includes(currentUserId)) {
        return res.status(403).json({ success: false, message: "Access denied to this room" });
      }

      // Block Dentist <-> Designer rooms (even if someone crafts roomId manually)
      const [userAId, userBId] = userIds;
      const users = await prisma.user.findMany({
        where: { id: { in: [userAId, userBId] } },
        select: { id: true, role: true },
      });
      if (users.length === 2) {
        const roleA = users.find((u) => u.id === userAId)?.role;
        const roleB = users.find((u) => u.id === userBId)?.role;
        if (isDentistDesignerPair(roleA, roleB)) {
          return res.status(403).json({ success: false, message: "Chat is not available between Dentist and Designer" });
        }
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

      // Mark room as read for current user
      await prisma.chatRoomRead.upsert({
        where: {
          userId_roomId: { userId: currentUserId, roomId },
        },
        create: { userId: currentUserId, roomId, lastReadAt: new Date() },
        update: { lastReadAt: new Date() },
      });

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
      const allowedRoles = ["ADMIN", "QC", "Dentist", "Designer"];
      if (!me || !allowedRoles.includes(me.role)) {
        return res.status(403).json({ success: false, message: "Chat is not available for your role" });
      }

      const where = {
        isDeleted: false,
        isActive: true,
        id: { not: currentUserId },
        email: { notIn: HIDDEN_SYSTEM_EMAILS },
      };
      if (me.role === "ADMIN") {
        where.role = { in: ["QC", "Dentist", "Designer"] };
      } else if (me.role === "QC") {
        where.role = { in: ["ADMIN", "Dentist", "Designer"] };
      } else if (me.role === "Dentist") {
        where.role = { in: ["ADMIN", "QC"] };
      } else if (me.role === "Designer") {
        where.role = { in: ["ADMIN", "QC"] };
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

      // Unread count per partner: messages in room sent by the other user after our lastReadAt
      const readRecords = await prisma.chatRoomRead.findMany({
        where: { userId: currentUserId },
        select: { roomId: true, lastReadAt: true },
      });
      const readMap = Object.fromEntries(readRecords.map((r) => [r.roomId, r.lastReadAt]));

      const partnersWithUnread = await Promise.all(
        partners.map(async (p) => {
          const roomId = getDmRoomId(currentUserId, p.id);
          if (!roomId) return { ...p, unreadCount: 0 };
          const lastReadAt = readMap[roomId] || new Date(0);
          const unreadCount = await prisma.chatMessage.count({
            where: {
              roomId,
              senderId: p.id,
              createdAt: { gt: lastReadAt },
            },
          });
          return { ...p, unreadCount };
        })
      );

      res.status(200).json({ success: true, data: partnersWithUnread });
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
