import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createTrip,
  getTrips,
  getTrip,
  getMyTrips,
  getPublicTrips,
  updateTrip,
  deleteTrip,
  uploadCover,
  addCollaborator,
  removeCollaborator,
} from "../controllers/trips.controller.js";
import { uploadMiddleware } from "../services/cloudinary.service.js";

const router = express.Router();

router.get("/my-trips", protect, getMyTrips);
router.get("/public", getPublicTrips);

router.route("/")
  .post(protect, createTrip)
  .get(protect, getTrips);

router.route("/:id")
  .get(protect, getTrip)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

router.post("/:id/cover", protect, uploadMiddleware.single("file"), uploadCover);
router.post("/:id/collaborators", protect, addCollaborator);
router.delete("/:id/collaborators", protect, removeCollaborator);


export default router;
