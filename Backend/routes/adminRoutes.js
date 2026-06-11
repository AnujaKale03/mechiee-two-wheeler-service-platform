const express = require("express");
const router  = express.Router();
const { login, getAnalytics, getCustomers, getWaitlisted } = require("../controllers/adminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

router.post("/login",      login);
router.get("/analytics",   verifyAdmin, getAnalytics);
router.get("/customers",   verifyAdmin, getCustomers);
router.get("/waitlisted",  verifyAdmin, getWaitlisted);

module.exports = router;