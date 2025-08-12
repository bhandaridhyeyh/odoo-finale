// src/controllers/document.controller.js
import * as documentService from "../services/document.service.js";

export const uploadDocument = async (req, res) => {
  try {
    const { tripId } = req.body;
    if (!tripId) {
      return res.status(400).json({ message: "tripId required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Call the service with file info and trip ID
    const doc = await documentService.uploadDocument({
      // If you're using multer memoryStorage:
      fileBuffer: req.file.buffer || null,
      filePath: req.file.path || null, // if using diskStorage
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedById: req.user?._id || null, // keep null if unauthenticated
      tripId,
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error("Error in uploadDocument:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await documentService.deleteDocument(id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
