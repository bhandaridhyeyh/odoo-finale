import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
} from "../controllers/trips.controller.js";

const router = express.Router();

router.route("/")
  .post(protect, createTrip)
  .get(protect, getTrips);

router.route("/:id")
  .get(protect, getTrip)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

export default router;
