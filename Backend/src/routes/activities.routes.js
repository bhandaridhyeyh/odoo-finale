// src/routes/activities.routes.js
import express from "express";
import {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activities.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

// /api/stops/:stopId/activities
router.post("/:stopId", protect, createActivity);
router.get("/:stopId", protect, getActivities);

// actions on individual activity
router.get("/activity/:id", protect, getActivity);
router.put("/activity/:id", protect, updateActivity);
router.delete("/activity/:id", protect, deleteActivity);

export default router;
