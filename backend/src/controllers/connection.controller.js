const Connection = require("../models/Connection");
const User = require("../models/User");

// ─────────────────────────────────────────
// CONNECT USING CHAT KEY
// POST /api/connections/connect
// ─────────────────────────────────────────
const connectWithKey = async (req, res) => {
  try {
    // The logged-in user (from JWT token via middleware)
    const myId = req.userId;

    // The chatKey they entered
    const { chatKey } = req.body;

    if (!chatKey) {
      return res.status(400).json({ message: "Chat key is required." });
    }

    // Step 1: Find the user who owns this chatKey
    const otherUser = await User.findOne({ chatKey });

    // No user found with this key
    if (!otherUser) {
      return res.status(404).json({ message: "Invalid chat key. User not found." });
    }

    // Step 2: Can't connect with yourself!
    if (otherUser._id.toString() === myId) {
      return res.status(400).json({ message: "You cannot connect with yourself." });
    }

    // Step 3: Sort IDs so A↔B and B↔A are always stored the same way
    // This prevents duplicate connections
    const [userA, userB] = [myId, otherUser._id.toString()].sort();

    // Step 4: Check if connection already exists
    const existingConnection = await Connection.findOne({ userA, userB });
    if (existingConnection) {
      return res.status(400).json({ message: "Already connected with this user." });
    }

    // Step 5: Create the connection
    const connection = await Connection.create({ userA, userB });

    // Step 6: Send back connection + other user's info
    res.status(201).json({
      message: "Connected successfully!",
      connection,
      connectedWith: {
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
      },
    });

  } catch (error) {
    console.error("Connect error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ─────────────────────────────────────────
// GET ALL MY CONNECTIONS
// GET /api/connections
// ─────────────────────────────────────────
const getConnections = async (req, res) => {
  try {
    const myId = req.userId;

    // Find all connections where I am either userA or userB
    const connections = await Connection.find({
      $or: [{ userA: myId }, { userB: myId }],
    })
      .populate("userA", "name email")  // replace userA id with actual user data
      .populate("userB", "name email"); // replace userB id with actual user data

    // Format the response
    // For each connection, return the OTHER person's info (not mine)
    const formattedConnections = connections.map((conn) => {
      const isUserA = conn.userA._id.toString() === myId;
      const otherUser = isUserA ? conn.userB : conn.userA;

      return {
        connectionId: conn._id,
        user: otherUser,
      };
    });

    res.status(200).json(formattedConnections);

  } catch (error) {
    console.error("Get connections error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { connectWithKey, getConnections };