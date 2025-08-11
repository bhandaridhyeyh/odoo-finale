// src/controllers/document.controller.js
import * as documentService from "../services/document.service.js";

export const uploadDocument = async (req, res) => {
  try {
    const tripId = req.body.tripId;
    if (!tripId) return res.status(400).json({ message: "tripId required" });
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const doc = await documentService.uploadDocument({
      fileBuffer: req.file.buffer,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedById: req.user._id,
      tripId,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await documentService.deleteDocument(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
