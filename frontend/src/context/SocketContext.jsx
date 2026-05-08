import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      // Small delay so Dashboard has time to load connections first
      setTimeout(() => {
        newSocket.emit("userOnline", user._id);
      }, 500);
    });

    // Handle reconnection automatically
    newSocket.on("reconnect", () => {
      console.log("🔄 Socket reconnected");
      newSocket.emit("userOnline", user._id);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);