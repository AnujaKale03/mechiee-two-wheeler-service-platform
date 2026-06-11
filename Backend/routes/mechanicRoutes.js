const express = require("express");
const router  = express.Router();
const { login, getMechanics, getProfile, savePushToken, getMyBookings } = require("../controllers/mechanicController");
const { verifyMechanic } = require("../middleware/authMiddleware");

router.post("/login",            login);
router.get("/",                  getMechanics);
router.get("/profile",           verifyMechanic, getProfile);
router.get("/my-bookings",       verifyMechanic, getMyBookings);
router.patch("/push-token",      verifyMechanic, savePushToken);

module.exports = router;