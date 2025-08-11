// src/routes/stops.routes.js
import express from "express";
import {
  createStop,
  getStops,
  getStop,
  updateStop,
  deleteStop,
} from "../controllers/stops.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// /api/trips/:tripId/stops
router.post("/:tripId", protect, createStop);
router.get("/:tripId", protect, getStops);

// individual stop actions
router.get("/stop/:id", protect, getStop);
router.put("/stop/:id", protect, updateStop);
router.delete("/stop/:id", protect, deleteStop);

export default router;
