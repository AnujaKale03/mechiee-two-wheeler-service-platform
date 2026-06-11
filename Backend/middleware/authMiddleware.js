const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Generic protect (customers, any role) ────────────────
exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Mechanics and admins have no User document — set req.user from JWT directly
    if (decoded.role === "mechanic" || decoded.role === "administrator") {
      req.user = { id: decoded.id, role: decoded.role, name: decoded.name };
      return next();
    }

    // Customers — verify they still exist and are active
    const user = await User.findById(decoded.id).select("-__v");
    if (!user) return res.status(401).json({ message: "User not found" });
    if (!user.isActive) return res.status(403).json({ message: "Account deactivated" });

    req.user = { ...user.toObject(), role: decoded.role ?? user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
// ── Role-based guard ─────────────────────────────────────
exports.requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: "Access denied: insufficient role" });
  }
  next();
};

// ── verifyMechanic — used by mechanicRoutes.js ───────────
// Decodes JWT and sets req.mechanic (controller reads req.mechanic.id)
exports.verifyMechanic = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "mechanic") {
      return res.status(403).json({ message: "Access denied: mechanics only" });
    }

    req.mechanic = decoded; // { id, name, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

// ── verifyAdmin — in case adminRoutes.js needs it ────────
exports.verifyAdmin = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "administrator") {
      return res.status(403).json({ message: "Access denied: admins only" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};