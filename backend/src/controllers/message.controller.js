const Message = require("../models/Message");
const Connection = require("../models/Connection");

// ─────────────────────────────────────────
// GET MESSAGE HISTORY
// GET /api/messages/:connectionId
// ─────────────────────────────────────────
const getMessages = async (req, res) => {
  try {
    const myId = req.userId;
    const { connectionId } = req.params;

    // Security check: make sure this connection belongs to me
    const connection = await Connection.findOne({
      _id: connectionId,
      $or: [{ userA: myId }, { userB: myId }],
    });

    if (!connection) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Fetch all messages for this connection
    // sorted by oldest first (for chat display)
    const messages = await Message.find({ connectionId })
      .sort({ createdAt: 1 })
      .populate("sender", "name"); // attach sender's name

    res.status(200).json(messages);

  } catch (error) {
    console.error("Get messages error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────
// SEND A MESSAGE (REST backup)
// POST /api/messages/:connectionId
// ─────────────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const myId = req.userId;
    const { connectionId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Message text is required." });
    }

    // Security check: verify connection belongs to me
    const connection = await Connection.findOne({
      _id: connectionId,
      $or: [{ userA: myId }, { userB: myId }],
    });

    if (!connection) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Save message to MongoDB
    const message = await Message.create({
      connectionId,
      sender: myId,
      text,
    });

    // Populate sender name before sending back
    await message.populate("sender", "name");

    res.status(201).json(message);

  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getMessages, sendMessage };