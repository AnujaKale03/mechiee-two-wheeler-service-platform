// src/utils/mechanicImages.js
// Central map for mechanic profile images.
// Keys must match mechanic names exactly as stored in MongoDB.
// To add a new mechanic image: add their name as key and require() the image.

const MECHANIC_IMAGES = {
  "Mechanic A": require("../assets/mechanics/mechanic_a.png"),
  "Mechanic B": require("../assets/mechanics/mechanic_B.png"),
  "Mechanic C": require("../assets/mechanics/mechanic_C.png"),
};

// Returns the image source for a mechanic by name.
// Falls back to null if no image is found — components handle the fallback UI.
export const getMechanicImage = (name) => {
  return MECHANIC_IMAGES[name] ?? null;
};

export default MECHANIC_IMAGES;