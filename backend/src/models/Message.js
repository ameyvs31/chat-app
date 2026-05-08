const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Which connection does this message belong to?
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
    },

    // Who sent this message?
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The actual message text
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt = message timestamp
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;