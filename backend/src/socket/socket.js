const { Server } = require("socket.io");
const Message = require("../models/Message");
const Connection = require("../models/Connection");

const onlineUsers = {};      // { userId: socketId }
const lastSeenMap = {};      // { userId: timestamp }

const initSocket = (server) => {
  const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

   // User comes online
socket.on("userOnline", (userId) => {
  onlineUsers[userId] = socket.id;
  console.log(`✅ ${userId} is online`);

  // Tell EVERYONE this user is now online
  io.emit("userStatusChanged", { userId, isOnline: true });

  // Also tell THIS user which of THEIR connections are currently online
  // So when Amey opens app, he immediately sees Rahul is online
  socket.emit("currentOnlineUsers", Object.keys(onlineUsers));
});
    // ── Send message ───────────────────────────
    socket.on("sendMessage", async (data) => {
      try {
        console.log("📨 Message received:", data);
        const { connectionId, senderId, text } = data;

        const connection = await Connection.findOne({
          _id: connectionId,
          $or: [{ userA: senderId }, { userB: senderId }],
        });
        if (!connection) return;

        const message = await Message.create({ connectionId, sender: senderId, text });
        await message.populate("sender", "name");

        const receiverId =
          connection.userA.toString() === senderId
            ? connection.userB.toString()
            : connection.userA.toString();

        // Send to receiver
        const receiverSocketId = onlineUsers[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
        }

        // Send back to sender
        socket.emit("receiveMessage", message);

      } catch (error) {
        console.error("❌ Socket error:", error.message);
      }
    });

    // ── Typing indicator ───────────────────────
    socket.on("typing", ({ connectionId, senderId, receiverId }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", { connectionId, senderId });
      }
    });

    socket.on("stopTyping", ({ connectionId, senderId, receiverId }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userStoppedTyping", { connectionId, senderId });
      }
    });

    // ── User disconnects ───────────────────────
    socket.on("disconnect", () => {
      for (const [userId, socketId] of Object.entries(onlineUsers)) {
        if (socketId === socket.id) {
          delete onlineUsers[userId];
          lastSeenMap[userId] = new Date();
          console.log(`❌ ${userId} went offline`);

          // Broadcast offline status + last seen
          io.emit("userStatusChanged", {
            userId,
            isOnline: false,
            lastSeen: lastSeenMap[userId],
          });
          break;
        }
      }
    });
  });
};

module.exports = { initSocket };