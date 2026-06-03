const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Service = require("../models/Service");
const Mechanic = require("../models/Mechanic");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await Service.deleteMany();
    await Mechanic.deleteMany();

    await Service.insertMany([
      {
        name: "Standard Service",
        price: 499,
      },
      {
        name: "Premium Service",
        price: 999,
      },
      {
        name: "Engine Repair",
        price: 1999,
      },
    ]);

    await Mechanic.insertMany([
      { name: "Mechanic A" },
      { name: "Mechanic B" },
      { name: "Mechanic C" },
    ]);

    console.log("Seed Data Inserted");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seedData();