// src/routes/documents.routes.js
import express from "express";
import { uploadMiddleware } from "../services/cloudinary.service.js";
import { uploadDocument, deleteDocument } from "../controllers/document.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, uploadMiddleware.single("file"), uploadDocument); // multipart form data: file + tripId
router.delete("/:id", protect, deleteDocument);

export default router;
