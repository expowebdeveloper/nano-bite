import {  useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MessageSquare, Send } from "lucide-react";
import { useChat, useChatPartners, getDmRoomId, type ChatPartner } from "../../hooks/useChat";

const Messages = () => {
  const { user } = useSelector((state: any) => state.user);
  const canAccessMessages = user?.role === "ADMIN" || user?.role === "QC";
  const currentUserId = user?.userId as string | undefined;

  const { data: partners = [], isLoading: partnersLoading } = useChatPartners();
  const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
  const selectedRoomId = selectedPartner && currentUserId
    ? getDmRoomId(currentUserId, selectedPartner.id)
    : null;

  const { messages, connected, sending, sendMessage, currentUserId: chatUserId } = useChat(selectedRoomId);
  const [input, setInput] = useState("");
  const listEndRef = useRef<HTMLDivElement>(null);

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
        {/* Sidebar: list of QC (for Admin) or Admin (for QC) */}
        <div className="w-64 shrink-0 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Chat with</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {user?.role === "ADMIN" ? "Select a QC user" : "Select an Admin"}
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
                    <p className="font-medium text-gray-900 truncate">{partnerDisplayName(p)}</p>
                    <p className="text-xs text-gray-500 truncate">{p.email}</p>
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
                  <h1 className="text-lg font-bold text-gray-900">
                    {partnerDisplayName(selectedPartner)}
                  </h1>
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
                  placeholder="Type a message…"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B89D2] focus:border-transparent"
                  disabled={!connected || sending}
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
