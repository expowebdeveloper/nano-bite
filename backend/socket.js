import { randomUUID } from "crypto";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma.js";

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
        // Cache other user's role so send_message skips a DB round-trip on every message (big on EC2 + remote DB).
        if (!socket.chatOtherRoleByRoom) socket.chatOtherRoleByRoom = Object.create(null);
        socket.chatOtherRoleByRoom[roomId] = other?.role ?? null;
        callback?.({ success: true });
      } catch (err) {
        callback?.({ success: false, message: "Failed to join room" });
      }
    });

    socket.on("leave_room", (roomId) => {
      if (roomId) {
        socket.leave(roomId);
        delete socket.chatOtherRoleByRoom?.[roomId];
      }
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
          let otherRole = socket.chatOtherRoleByRoom?.[roomId];
          if (otherRole === undefined) {
            const other = await prisma.user.findUnique({
              where: { id: otherUserId },
              select: { role: true },
            });
            otherRole = other?.role ?? null;
            if (!socket.chatOtherRoleByRoom) socket.chatOtherRoleByRoom = Object.create(null);
            socket.chatOtherRoleByRoom[roomId] = otherRole;
          }
          if (isDentistDesignerPair(socket.user?.role, otherRole)) {
            callback?.({ success: false, message: "Chat is not available between Dentist and Designer" });
            return;
          }
        }

        // Pre-generate id so we can broadcast immediately (instant UX) then persist the same row.
        const id = randomUUID();
        const createdAt = new Date().toISOString();
        const optimistic = {
          id,
          roomId,
          senderId: socket.userId,
          content: trimmed,
          createdAt,
          sender: {
            id: socket.user.id,
            fullName: socket.user.fullName,
            email: socket.user.email,
            role: socket.user.role,
          },
        };

        io.to(roomId).emit("new_message", optimistic);

        let message;
        try {
          message = await prisma.chatMessage.create({
            data: {
              id,
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
        } catch (dbErr) {
          console.error("Chat save error:", dbErr);
          io.to(roomId).emit("message_revoked", { id, roomId });
          callback?.({ success: false, message: "Failed to send message" });
          return;
        }

        callback?.({ success: true, data: message });
      } catch (err) {
        console.error("Chat send error:", err);
        callback?.({ success: false, message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
}
