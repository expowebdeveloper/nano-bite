import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";

export type ChatMessage = {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    fullName: string | null;
    email: string;
    role: string;
  };
};

export type ChatPartner = {
  id: string;
  fullName: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  role: string;
  unreadCount?: number;
};

/** Build the same DM room id as the backend (order-independent). */
export function getDmRoomId(userId1: string, userId2: string): string {
  if (!userId1 || !userId2) return "";
  const [a, b] = [userId1, userId2].sort();
  return `dm_${a}_${b}`;
}

const getSocketUrl = () => {
  const url = import.meta.env.VITE_API_URL || "";
  return url.replace(/\/$/, "");
};

export function useChatPartners() {
  const { user } = useSelector((state: any) => state.user);
  const { request } = useAuth();
  return useQuery<ChatPartner[]>({
    queryKey: ["chat", "partners", user?.token],
    queryFn: async () => {
      const res = await request.get("/chat/partners");
      return res.data?.data ?? [];
    },
    enabled: !!user?.token && ["ADMIN", "QC", "Dentist", "Designer"].includes(user?.role ?? ""),
    refetchOnWindowFocus: false,
  });
}

export function useChat(selectedRoomId: string | null, onNewMessageInOtherRoom?: () => void) {
  const { user } = useSelector((state: any) => state.user);
  const { request } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const token = user?.token;
  const currentUserId = user?.userId ?? user?.id;
  const selectedRoomIdRef = useRef(selectedRoomId);
  selectedRoomIdRef.current = selectedRoomId;
  const onNewMessageRef = useRef(onNewMessageInOtherRoom);
  onNewMessageRef.current = onNewMessageInOtherRoom;

  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ["chat", "messages", token, selectedRoomId],
    queryFn: async () => {
      if (!selectedRoomId) return [];
      const res = await request.get("/chat/messages", {
        params: { roomId: selectedRoomId },
      });
      return res.data?.data ?? [];
    },
    enabled: !!token && !!selectedRoomId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (historyData && Array.isArray(historyData)) {
      setMessages(historyData);
    } else if (!selectedRoomId) {
      setMessages([]);
    }
  }, [historyData, selectedRoomId]);

  useEffect(() => {
    if (!token) return;
    const socketUrl = getSocketUrl();
    if (!socketUrl) return;

    const s = io(socketUrl, {
      path: "/socket.io/",
      auth: { token },
      transports: ["websocket", "polling"],
    });

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("connect_error", () => setConnected(false));

    s.on("new_message", (msg: ChatMessage) => {
      const currentRoom = selectedRoomIdRef.current;
      if (msg.roomId !== currentRoom) {
        onNewMessageRef.current?.();
      }
      setMessages((prev) => {
        if (msg.roomId !== currentRoom || prev.some((m) => m.id === msg.id))
          return prev;
        return [...prev, msg];
      });
    });

    s.on("message_revoked", (payload: { id: string }) => {
      if (!payload?.id) return;
      setMessages((prev) => prev.filter((m) => m.id !== payload.id));
    });

    setSocket(s);
    return () => {
      s.removeAllListeners();
      s.close();
      setSocket(null);
      setConnected(false);
    };
  }, [token]);

  useEffect(() => {
    if (!socket?.connected || !selectedRoomId) return;
    socket.emit("join_room", selectedRoomId, (ack: { success?: boolean }) => {
      if (!ack?.success) return;
    });
    return () => {
      socket.emit("leave_room", selectedRoomId);
    };
  }, [socket, selectedRoomId]);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !socket?.connected || !selectedRoomId)
        return Promise.resolve(false);
      setSending(true);
      return new Promise<boolean>((resolve) => {
        socket.emit(
          "send_message",
          { content: trimmed, roomId: selectedRoomId },
          (ack: { success?: boolean }) => {
            resolve(ack?.success ?? false);
          }
        );
        // Server broadcasts new_message before DB write; re-enable input immediately.
        setSending(false);
      });
    },
    [socket, selectedRoomId]
  );

  return {
    messages,
    connected,
    sending,
    sendMessage,
    refetchHistory,
    currentUserId,
    historyLoaded: !!selectedRoomId && Array.isArray(historyData),
  };
}
