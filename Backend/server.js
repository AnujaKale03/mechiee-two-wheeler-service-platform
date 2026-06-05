const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const serviceRoutes = require("./routes/serviceRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const logger = require("./middleware/loggerMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(logger);
app.use(express.json());

// Routes
app.use("/api/services", serviceRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/bookings", bookingRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Mechiee API Running");
});

// Error Handling Middleware
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});