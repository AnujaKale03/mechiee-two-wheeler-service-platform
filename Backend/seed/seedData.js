const mongoose = require("mongoose");
const dotenv   = require("dotenv");
dotenv.config({ path: "../.env" });

const Mechanic = require("../models/Mechanic");
const Service  = require("../models/Service");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Mechanic.deleteMany({});
  await Service.deleteMany({});

  await Mechanic.insertMany([
    { name: "Mechanic A", pin: "1111", phone: "9876543210" },
    { name: "Mechanic B", pin: "2222", phone: "9876543211" },
    { name: "Mechanic C", pin: "3333", phone: "9876543212" },
  ]);

  await Service.insertMany([
    { name: "Standard Service", price: 499,  description: "Basic service including oil change, filter cleaning, and inspection.", durationMins: 60 },
    { name: "Premium Service",  price: 999,  description: "Comprehensive service with brake check, chain lubrication, and full inspection.", durationMins: 90 },
    { name: "Engine Repair",    price: 1999, description: "Full engine diagnostics and repair by certified mechanics.", durationMins: 180 },
  ]);

  console.log("✅ Seeded mechanics (A:1111, B:2222, C:3333) and services");
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });