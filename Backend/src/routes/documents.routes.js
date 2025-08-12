// src/routes/documents.routes.js
import express from "express";
import { uploadMiddleware } from "../services/cloudinary.service.js";
import { uploadDocument, deleteDocument } from "../controllers/document.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { Document } from "../models/Document.model.js";

const router = express.Router();

// Upload document
router.post("/", protect, uploadMiddleware.single("file"), uploadDocument); 
// multipart form-data: file + tripId

// Delete document
router.delete("/:id", protect, deleteDocument);

// Get documents for a trip
router.get("/", protect, async (req, res) => {
  try {
    const { tripId } = req.query;
    if (!tripId) {
      return res.status(400).json({ message: "tripId required" });
    }

    const docs = await Document.find({ trip: tripId }).sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    console.error("Error fetching documents:", err);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
