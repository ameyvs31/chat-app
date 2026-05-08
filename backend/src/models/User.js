const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // for generating unique chatKey

const userSchema = new mongoose.Schema(
  {
    // User's display name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User's email (must be unique)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password (never store plain text!)
    password: {
      type: String,
      required: true,
    },

    // 🔑 THE MAIN FEATURE — unique key to connect with this user
    // Generated automatically when user signs up
    chatKey: {
      type: String,
      unique: true,
      default: () => uuidv4().slice(0, 8).toUpperCase(), // e.g. "A1B2C3D4"
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;