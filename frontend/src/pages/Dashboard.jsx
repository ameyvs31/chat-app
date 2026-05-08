import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios";
import { useSocket } from "../context/SocketContext";
import Navbar from "../components/Navbar";
import ChatKeyInput from "../components/ChatKeyInput";
import ConnectionsList from "../components/ConnectionsList";
import ChatWindow from "../components/ChatWindow";

const Dashboard = () => {
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]); // ✅ track online users
  const { socket } = useSocket();

  // Fetch connections and immediately apply online status
  const fetchConnections = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/connections");
      const fetched = res.data;

      // Apply currently known online users to fresh connections list
      const withStatus = fetched.map((conn) => ({
        ...conn,
        isOnline: onlineUserIds.includes(conn.user._id),
      }));

      setConnections(withStatus);
    } catch (err) {
      console.error("Failed to fetch connections:", err);
    }
  }, [onlineUserIds]);

  // Fetch on first load
  useEffect(() => {
    fetchConnections();
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    // ✅ Server tells us who is currently online
    socket.on("currentOnlineUsers", (ids) => {
      console.log("🟢 Currently online:", ids);
      setOnlineUserIds(ids);

      // Update connections list with online status
      setConnections((prev) =>
        prev.map((conn) => ({
          ...conn,
          isOnline: ids.includes(conn.user._id),
        }))
      );

      // Update selected connection too
      setSelectedConnection((prev) =>
        prev ? { ...prev, isOnline: ids.includes(prev.user._id) } : prev
      );
    });

    // ✅ Someone's status changed (online/offline)
    socket.on("userStatusChanged", ({ userId, isOnline, lastSeen }) => {
      console.log(`👤 ${userId} is now ${isOnline ? "online" : "offline"}`);

      // Update online list
      setOnlineUserIds((prev) =>
        isOnline
          ? [...new Set([...prev, userId])]  // add
          : prev.filter((id) => id !== userId) // remove
      );

      // Update connections list
      setConnections((prev) =>
        prev.map((conn) =>
          conn.user._id === userId
            ? { ...conn, isOnline, lastSeen }
            : conn
        )
      );

      // Update selected connection
      setSelectedConnection((prev) =>
        prev?.user._id === userId
          ? { ...prev, isOnline, lastSeen }
          : prev
      );
    });

    return () => {
      socket.off("currentOnlineUsers");
      socket.off("userStatusChanged");
    };
  }, [socket]);

  // ✅ When socket connects, ask for current online users again
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("🔌 Socket reconnected — refreshing online status");
      fetchConnections();
    });

    return () => socket.off("connect");
  }, [socket, fetchConnections]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800 transition-colors">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900 transition-colors">
          <ChatKeyInput onConnected={fetchConnections} />
          <ConnectionsList
            connections={connections}
            selectedConnection={selectedConnection}
            onSelect={setSelectedConnection}
          />
        </div>
        <ChatWindow selectedConnection={selectedConnection} />
      </div>
    </div>
  );
};

export default Dashboard;