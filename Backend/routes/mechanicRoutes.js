const express = require("express");
const router = express.Router();

const {
  getMechanics,
} = require("../controllers/mechanicController");

router.get("/", getMechanics);

module.exports = router;