import { useState } from "react";
import axiosInstance from "../api/axios";

const ChatKeyInput = ({ onConnected }) => {
  const [chatKey, setChatKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleConnect = async () => {
    if (!chatKey.trim()) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/connections/connect", {
        chatKey: chatKey.trim().toUpperCase(),
      });
      setSuccess(`Connected with ${res.data.connectedWith.name}! 🎉`);
      setChatKey("");
      onConnected();
    } catch (err) {
      setError(err.response?.data?.message || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wide">
        Connect with someone
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Chat Key..."
          value={chatKey}
          onChange={(e) => setChatKey(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <button
          onClick={handleConnect}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "..." : "Connect"}
        </button>
      </div>
      {success && <p className="text-green-600 text-xs mt-2">{success}</p>}
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default ChatKeyInput;