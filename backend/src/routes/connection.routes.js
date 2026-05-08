const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/auth.middleware");
const { connectWithKey, getConnections } = require("../controllers/connection.controller");

// POST /api/connections/connect → enter chatKey to connect
// protectRoute runs FIRST (checks JWT), then connectWithKey runs
router.post("/connect", protectRoute, connectWithKey);

// GET /api/connections → get all my connected users
router.get("/", protectRoute, getConnections);

module.exports = router;