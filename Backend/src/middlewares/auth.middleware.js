// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Middleware: Protect routes (requires valid JWT)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userId = decoded.sub || decoded.id;

    // Attach user object to request (without password)
    req.user = await User.findById(userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

// Middleware: Role-based access control
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles || !allowedRoles.some(role => req.user.roles.includes(role))) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};