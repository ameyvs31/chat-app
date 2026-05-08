import { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import MessageBubble from "./MessageBubble";
import ThemePicker from "./ThemePicker";
import themes from "../config/themes";

const ChatWindow = ({ selectedConnection }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("default");
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load saved theme for this connection
  useEffect(() => {
    if (!selectedConnection) return;
    const saved = localStorage.getItem(
      `theme_${selectedConnection.connectionId}`
    );
    setCurrentTheme(saved || "default");
    setIsTyping(false);
  }, [selectedConnection]);

  // Save theme when changed
  const handleThemeSelect = (themeKey) => {
    setCurrentTheme(themeKey);
    localStorage.setItem(
      `theme_${selectedConnection.connectionId}`,
      themeKey
    );
    setShowThemePicker(false);
  };

  // Get current theme config
  const t = themes[currentTheme];
  const c = t.custom || null;

  // Fetch messages
  useEffect(() => {
    if (!selectedConnection) return;
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/messages/${selectedConnection.connectionId}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [selectedConnection]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", (newMessage) => {
      if (newMessage.connectionId === selectedConnection?.connectionId) {
        setMessages((prev) => [...prev, newMessage]);
        setIsTyping(false);
      }
    });
    socket.on("userTyping", ({ connectionId }) => {
      if (connectionId === selectedConnection?.connectionId) setIsTyping(true);
    });
    socket.on("userStoppedTyping", ({ connectionId }) => {
      if (connectionId === selectedConnection?.connectionId) setIsTyping(false);
    });
    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket, selectedConnection]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Typing handler
  const handleTyping = (e) => {
    setText(e.target.value);
    if (!socket || !selectedConnection) return;
    socket.emit("typing", {
      connectionId: selectedConnection.connectionId,
      senderId: user._id,
      receiverId: selectedConnection.user._id,
    });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        connectionId: selectedConnection.connectionId,
        senderId: user._id,
        receiverId: selectedConnection.user._id,
      });
    }, 2000);
  };

  // Send message
  const handleSend = () => {
    if (!text.trim() || !socket) return;
    socket.emit("sendMessage", {
      connectionId: selectedConnection.connectionId,
      senderId: user._id,
      text: text.trim(),
    });
    socket.emit("stopTyping", {
      connectionId: selectedConnection.connectionId,
      senderId: user._id,
      receiverId: selectedConnection.user._id,
    });
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // No chat selected
  if (!selectedConnection) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center text-gray-400">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-lg font-semibold dark:text-gray-300">
            Select a chat to start messaging
          </p>
          <p className="text-sm">Or connect with someone using their Chat Key</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col transition-colors relative"
      style={c ? { background: c.chatBg } : {}}
    >

      {/* Header */}
      <div
        className={`px-6 py-4 border-b flex items-center justify-between ${!c ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700" : ""}`}
        style={c ? { background: c.headerBg, borderColor: c.headerBorder } : {}}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: c ? c.sentBg : "#378ADD", color: c ? c.sentText : "white" }}
            >
              {selectedConnection.user.name.charAt(0).toUpperCase()}
            </div>
            {selectedConnection.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <p
              className="font-semibold text-sm"
              style={c ? { color: c.sentText } : {}}
            >
              {selectedConnection.user.name}
            </p>
            <p
              className="text-xs"
              style={{ color: c ? c.accentText : undefined }}
            >
              {selectedConnection.isOnline ? (
                <span style={{ color: "#1D9E75" }}>● Online</span>
              ) : selectedConnection.lastSeen ? (
                `Last seen: ${new Date(selectedConnection.lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              ) : (
                <span>Offline</span>
              )}
            </p>
          </div>
        </div>

        {/* Theme picker button */}
        <button
          onClick={() => setShowThemePicker(!showThemePicker)}
          title="Change chat theme"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            padding: "4px 8px",
            borderRadius: "8px",
            color: c ? c.accentText : "#888",
          }}
        >
          🎨
        </button>
      </div>

      {/* Theme Picker Dropdown */}
      {showThemePicker && (
        <ThemePicker
          currentTheme={currentTheme}
          onSelect={handleThemeSelect}
          onClose={() => setShowThemePicker(false)}
        />
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-6 py-4"
        style={c ? { background: c.chatBg } : { background: undefined }}
      >
        {messages.length === 0 && (
          <p
            className="text-center text-sm mt-10"
            style={{ color: c ? c.accentText : "#9ca3af" }}
          >
            No messages yet. Say hello! 👋
          </p>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender._id === user._id;
          const time = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit", minute: "2-digit",
          });
          return (
            <div
              key={msg._id}
              className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: isMe
                    ? (c?.sentRadius || "14px 14px 2px 14px")
                    : (c?.recvRadius || "14px 14px 14px 2px"),
                  background: isMe
                    ? (c ? c.sentBg : "#3b82f6")
                    : (c ? c.recvBg : "#ffffff"),
                  color: isMe
                    ? (c ? c.sentText : "#ffffff")
                    : (c ? c.recvText : "#1f2937"),
                  fontSize: "13px",
                  maxWidth: "70%",
                  border: (!isMe && !c) ? "1px solid #e5e7eb" : "none",
                }}
              >
                <p>{msg.text}</p>
                <p style={{
                  fontSize: "10px",
                  marginTop: "3px",
                  textAlign: "right",
                  opacity: 0.65,
                }}>
                  {time}
                </p>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mb-2">
            <div
              style={{
                background: c ? c.recvBg : "#ffffff",
                border: c ? "none" : "1px solid #e5e7eb",
                padding: "8px 14px",
                borderRadius: "14px 14px 14px 2px",
              }}
            >
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: c ? c.accentText : "#9ca3af", animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: c ? c.accentText : "#9ca3af", animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: c ? c.accentText : "#9ca3af", animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 flex gap-3 border-t"
        style={c ? { background: c.inputBg, borderColor: c.inputBorder } : {}}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          className={`flex-1 rounded-full px-4 py-2 text-sm focus:outline-none ${!c ? "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white" : ""}`}
          style={c ? {
            background: c.inputFieldBg,
            border: `0.5px solid ${c.inputFieldBorder}`,
            color: c.recvText,
          } : {}}
        />
        <button
          onClick={handleSend}
          className="px-5 py-2 rounded-full text-sm font-semibold transition"
          style={c ? { background: c.sendBtn, color: c.sentText } : {}}
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default ChatWindow;