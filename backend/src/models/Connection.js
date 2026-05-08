const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    // The two users who are connected
    // We always store them so that userA < userB (alphabetically)
    // This prevents duplicate connections like A↔B and B↔A
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate connections between same two users
connectionSchema.index({ userA: 1, userB: 1 }, { unique: true });

const Connection = mongoose.model("Connection", connectionSchema);

module.exports = Connection;