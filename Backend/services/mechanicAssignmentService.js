const Mechanic = require("../models/Mechanic");

const assignMechanic = async () => {
  const mechanics = await Mechanic.find();

  mechanics.sort(
    (a, b) => a.activeBookingCount - b.activeBookingCount
  );

  const mechanic = mechanics[0];

  if (mechanic && mechanic.activeBookingCount < 3) {
    mechanic.activeBookingCount += 1;

    await mechanic.save();

    return {
      mechanicId: mechanic._id,
      status: "ASSIGNED",
    };
  }

  return {
    mechanicId: null,
    status: "WAITLISTED",
  };
};

module.exports = assignMechanic;