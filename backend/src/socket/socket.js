const { Server } = require("socket.io");
const Message = require("../models/Message");
const Connection = require("../models/Connection");

const onlineUsers = {};
const lastSeenMap = {};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        process.env.CLIENT_URL,
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // ── User comes online ──────────────────
    socket.on("userOnline", (userId) => {
      onlineUsers[userId] = socket.id;
      console.log(`✅ ${userId} is online`);

      // Tell everyone this user is online
      io.emit("userStatusChanged", { userId, isOnline: true });

      // Tell THIS user who is currently online
      socket.emit("currentOnlineUsers", Object.keys(onlineUsers));
    });

    // ── Send message ───────────────────────
    socket.on("sendMessage", async (data) => {
      try {
        console.log("📨 Message received:", data);
        const { connectionId, senderId, text } = data;

        const connection = await Connection.findOne({
          _id: connectionId,
          $or: [{ userA: senderId }, { userB: senderId }],
        });

        if (!connection) {
          console.log("❌ Connection not found!");
          return;
        }

        const message = await Message.create({
          connectionId,
          sender: senderId,
          text,
        });

        await message.populate("sender", "name");
        console.log("✅ Message saved:", message.text);

        const receiverId =
          connection.userA.toString() === senderId
            ? connection.userB.toString()
            : connection.userA.toString();

        // Send to receiver if online
        const receiverSocketId = onlineUsers[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
          console.log("✅ Message delivered to receiver");
        } else {
          console.log("⚠️ Receiver is offline");
        }

        // Send back to sender
        socket.emit("receiveMessage", message);

      } catch (error) {
        console.error("❌ Socket error:", error.message);
      }
    });

    // ── Typing indicator ───────────────────
    socket.on("typing", ({ connectionId, senderId, receiverId }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          connectionId,
          senderId,
        });
      }
    });

    socket.on("stopTyping", ({ connectionId, senderId, receiverId }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userStoppedTyping", {
          connectionId,
          senderId,
        });
      }
    });

    // ── User disconnects ───────────────────
    socket.on("disconnect", () => {
      for (const [userId, socketId] of Object.entries(onlineUsers)) {
        if (socketId === socket.id) {
          delete onlineUsers[userId];
          lastSeenMap[userId] = new Date();
          console.log(`❌ ${userId} went offline`);

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