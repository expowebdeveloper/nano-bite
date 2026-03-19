import { useRef, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send } from "lucide-react";
import { useChat, useChatPartners, getDmRoomId, type ChatPartner } from "../../hooks/useChat";

const Messages = () => {
  const { user } = useSelector((state: any) => state.user);
  const queryClient = useQueryClient();
  const canAccessMessages = ["ADMIN", "QC", "Dentist", "Designer"].includes(user?.role ?? "");
  const currentUserId = (user?.userId ?? user?.id) as string | undefined;

  const { data: partners = [], isLoading: partnersLoading } = useChatPartners();
  const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
  const selectedRoomId = selectedPartner && currentUserId
    ? getDmRoomId(currentUserId, selectedPartner.id)
    : null;

  const { messages, connected, sending, sendMessage, currentUserId: chatUserId, historyLoaded } = useChat(
    selectedRoomId,
    () => queryClient.invalidateQueries({ queryKey: ["chat", "partners"] })
  );
  const [input, setInput] = useState("");
  const listEndRef = useRef<HTMLDivElement>(null);

  // Refetch partners when current room is marked read (history loaded) so unread counts update
  useEffect(() => {
    if (selectedPartner && historyLoaded) {
      queryClient.invalidateQueries({ queryKey: ["chat", "partners"] });
    }
  }, [selectedPartner?.id, historyLoaded, queryClient]);

  // useEffect(() => {
  //   listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  if (!canAccessMessages) {
    return <Navigate to="/dashboard" replace />;
  }

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();
      if (isToday) {
        return d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
      }
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const partnerDisplayName = (p: ChatPartner) =>
    p.fullName || [p.first_name, p.last_name].filter(Boolean).join(" ").trim() || p.email || "User";

  return (
    <div className="min-h-screen bg-[#fbfeff] p-4 md:p-8">
      <div className="mx-auto max-w-5xl flex gap-4 h-[calc(100vh-6rem)] min-h-[500px]">
        {/* Sidebar: partners depend on role (Admin→QC, QC→Admin/Dentist/Designer, Dentist/Designer→QC) */}
        <div className="w-64 shrink-0 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Chat with</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {user?.role === "ADMIN"
                ? "Select QC, Dentist, or Designer"
                : user?.role === "QC"
                  ? "Select Admin, Dentist, or Designer"
                  : user?.role === "Dentist"
                    ? "Select Admin or QC"
                    : "Select Admin or QC"}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {partnersLoading ? (
              <p className="p-4 text-sm text-gray-500">Loading…</p>
            ) : partners.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No one to chat with yet.</p>
            ) : (
              partners.map((p) => {
                const isSelected = selectedPartner?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPartner(p)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-[#f0f7ff] transition-colors ${
                      isSelected ? "bg-[#e8f4ff] border-l-4 border-l-[#2B89D2]" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{partnerDisplayName(p)}</p>
                        <p className="text-xs text-gray-500 truncate">{p.email}</p>
                        {p.role && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#e0f0ff] text-[#1e6bb8]">
                            {p.role}
                          </span>
                        )}
                      </div>
                      {(p.unreadCount ?? 0) > 0 && (
                        <span className="shrink-0 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-semibold bg-[#2B89D2] text-white">
                          {p.unreadCount! > 99 ? "99+" : p.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col min-w-0">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              {selectedPartner ? (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-bold text-gray-900">
                      {partnerDisplayName(selectedPartner)}
                    </h1>
                    {selectedPartner.role && (
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e0f0ff] text-[#1e6bb8]">
                        {selectedPartner.role}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{selectedPartner.email}</p>
                </>
              ) : (
                <h1 className="text-lg font-bold text-gray-500 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Select someone to start chatting
                </h1>
              )}
            </div>
            {selectedPartner && (
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  connected
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {connected ? "Connected" : "Connecting…"}
              </span>
            )}
          </div>

          {selectedPartner ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-8">
                    No messages yet. Say hello!
                  </p>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === chatUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          isMe
                            ? "bg-[#2B89D2] text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        {!isMe && (
                          <p className="text-xs font-semibold text-gray-600 mb-0.5">
                            {msg.sender?.fullName || msg.sender?.email || "User"}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isMe ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={listEndRef} />
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-gray-100 flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={connected ? "Type a message…" : "Connecting…"}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B89D2] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  disabled={sending}
                  maxLength={2000}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || !connected || sending}
                  className="rounded-xl bg-[#2B89D2] text-white p-3 hover:bg-[#2369a8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Choose a user from the list to start a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
