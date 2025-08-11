// src/routes/user.routes.js
import express from "express";
import { getMyProfile, updateMyProfile, getUserById, listUsers } from "../controllers/users.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Authenticated user's profile
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// Get a user by ID (only admin or self via middleware)
router.get("/:id", protect, authorize("admin"), getUserById);

// List all users (admin only)
router.get("/", protect, authorize("admin"), listUsers);

export default router;
