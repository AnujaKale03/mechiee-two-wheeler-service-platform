const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// ── Routes ───────────────────────────────────────────────
const authRoutes         = require("./routes/authRoutes");
const bookingRoutes      = require("./routes/bookingRoutes");
const mechanicRoutes     = require("./routes/mechanicRoutes");
const serviceRoutes      = require("./routes/serviceRoutes");
const adminRoutes        = require("./routes/adminRoutes");
const chatRoutes         = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notifications");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ── Health check ─────────────────────────────────────────
app.get("/", (req, res) => res.send("Mechiee API Running ✅"));

// ── API routes ───────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/bookings",      bookingRoutes);
app.use("/api/mechanics",     mechanicRoutes);
app.use("/api/services",      serviceRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/chat",          chatRoutes);
app.use("/api/notifications", notificationRoutes);

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));