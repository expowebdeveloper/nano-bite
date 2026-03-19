import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma.js";
import { getDmRoomId } from "./controllers/chat.js";

function parseDmRoomId(roomId) {
  if (!roomId || !roomId.startsWith("dm_")) return null;
  const parts = roomId.slice(3).split("_");
  return parts.length >= 2 ? [parts[0], parts[1]] : null;
}

function userAllowedInRoom(userId, roomId) {
  const ids = parseDmRoomId(roomId);
  return ids && ids.includes(userId);
}

function isDentistDesignerPair(roleA, roleB) {
  const a = roleA || "";
  const b = roleB || "";
  return (
    (a === "Dentist" && b === "Designer") ||
    (a === "Designer" && b === "Dentist")
  );
}

export function setupSocketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
    path: "/socket.io/",
  });

  const getUserIdFromToken = async (token) => {
    if (!token) return null;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded?.data?.id ?? null;
    } catch {
      return null;
    }
  };

  io.use(async (socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");
    const userId = await getUserIdFromToken(token);
    if (!userId) {
      return next(new Error("Authentication required"));
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, role: true },
    });
    const chatRoles = ["ADMIN", "QC", "Dentist", "Designer"];
    if (!user || !chatRoles.includes(user.role)) {
      return next(new Error("Chat is not available for your role"));
    }
    socket.userId = user.id;
    socket.user = user;
    next();
  });

  io.on("connection", (socket) => {
    socket.on("join_room", async (roomId, callback) => {
      try {
        if (!roomId || !userAllowedInRoom(socket.userId, roomId)) {
          callback?.({ success: false, message: "Invalid or unauthorized room" });
          return;
        }

        const ids = parseDmRoomId(roomId);
        const otherUserId = ids?.find((id) => id !== socket.userId) ?? null;
        if (!otherUserId) {
          callback?.({ success: false, message: "Invalid room" });
          return;
        }

        const other = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: { role: true },
        });
        if (isDentistDesignerPair(socket.user?.role, other?.role)) {
          callback?.({ success: false, message: "Chat is not available between Dentist and Designer" });
          return;
        }

        socket.join(roomId);
        callback?.({ success: true });
      } catch (err) {
        callback?.({ success: false, message: "Failed to join room" });
      }
    });

    socket.on("leave_room", (roomId) => {
      if (roomId) socket.leave(roomId);
    });

    socket.on("send_message", async (payload, callback) => {
      const roomId =
        typeof payload === "object" && payload?.roomId
          ? payload.roomId
          : null;
      const content =
        typeof payload === "object"
          ? payload?.content ?? ""
          : typeof payload === "string"
            ? payload
            : "";
      const trimmed = content.trim();
      if (!trimmed) {
        callback?.({ success: false, message: "Message cannot be empty" });
        return;
      }
      if (!roomId || !userAllowedInRoom(socket.userId, roomId)) {
        callback?.({ success: false, message: "Invalid or unauthorized room" });
        return;
      }
      try {
        const ids = parseDmRoomId(roomId);
        const otherUserId = ids?.find((id) => id !== socket.userId) ?? null;
        if (otherUserId) {
          const other = await prisma.user.findUnique({
            where: { id: otherUserId },
            select: { role: true },
          });
          if (isDentistDesignerPair(socket.user?.role, other?.role)) {
            callback?.({ success: false, message: "Chat is not available between Dentist and Designer" });
            return;
          }
        }

        const message = await prisma.chatMessage.create({
          data: {
            roomId,
            senderId: socket.userId,
            content: trimmed,
          },
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
        io.to(roomId).emit("new_message", message);
        callback?.({ success: true, data: message });
      } catch (err) {
        console.error("Chat save error:", err);
        callback?.({ success: false, message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
}
