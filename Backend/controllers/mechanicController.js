const Mechanic = require("../models/Mechanic");

const getMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find();

    res.status(200).json(mechanics);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMechanics,
};