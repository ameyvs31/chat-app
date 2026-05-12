const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");

dotenv.config();

const connectDB = require("./src/config/db");
connectDB();

const app = express();
const server = http.createServer(app);

// ─── CORS ─────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

// ─── Rate Limiter ──────────────────────────
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests. Try again later." },
});
app.use("/api/", limiter);

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