const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/auth.middleware");
const { getMessages, sendMessage } = require("../controllers/message.controller");

// GET /api/messages/:connectionId → fetch chat history
router.get("/:connectionId", protectRoute, getMessages);

// POST /api/messages/:connectionId → send a message
router.post("/:connectionId", protectRoute, sendMessage);

module.exports = router;