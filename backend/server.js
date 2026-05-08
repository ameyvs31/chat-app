const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");

dotenv.config();

const connectDB = require("./src/config/db");
connectDB();

const app = express();
const server = http.createServer(app);

// ─── CORS (allow only your frontend URL) ──
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" })); // limit request size

// ─── Routes ───────────────────────────────
const authRoutes = require("./src/routes/auth.routes");
const connectionRoutes = require("./src/routes/connection.routes");
const messageRoutes = require("./src/routes/message.routes");

app.use("/api/auth", authRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages", messageRoutes);

// ─── 404 Handler ──────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Global Error Handler ──────────────────
app.use((err, req, res, next) => {
  console.error("Global error:", err.message);
  res.status(500).json({ message: "Something went wrong." });
});

// ─── Socket.io ────────────────────────────
const { initSocket } = require("./src/socket/socket");
initSocket(server);

// ─── Start Server ─────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});