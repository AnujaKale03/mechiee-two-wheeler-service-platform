const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const serviceRoutes = require("./routes/serviceRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const cors = require("cors");
const logger = require(
  "./middleware/loggerMiddleware"
);
const errorHandler = require(
  "./middleware/errorMiddleware"
);

dotenv.config();

connectDB();

const app = express();
app.use(cors());

app.use(logger);
app.use(express.json());
app.use("/api/bookings", bookingRoutes);
app.use("/api/mechanics", mechanicRoutes);


app.get("/", (req, res) => {
  res.send("Mechiee API Running");
});

const PORT = process.env.PORT || 5000;

app.use("/api/services", serviceRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});