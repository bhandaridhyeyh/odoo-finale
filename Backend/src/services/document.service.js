// src/services/document.service.js
import { Document } from "../models/Document.model.js";
import { Trip } from "../models/Trip.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "./cloudinary.service.js";

export const uploadDocument = async ({
  fileBuffer,
  originalname,
  mimetype,
  size,
  uploadedById,
  tripId,
}) => {
  // Upload file buffer to Cloudinary
  const uploadResult = await uploadBufferToCloudinary(fileBuffer, `trips/${tripId}`);

  // Save document in DB
  const doc = await Document.create({
    trip: tripId,
    uploadedBy: uploadedById,
    filename: originalname,
    url: uploadResult.secure_url,
    cloudinaryId: uploadResult.public_id,
    mimeType: mimetype,
    size,
  });

  // Attach document ID to the trip
  await Trip.findByIdAndUpdate(tripId, { $push: { documents: doc._id } });

  return doc;
};

export const deleteDocument = async (docId) => {
  const doc = await Document.findById(docId);
  if (!doc) throw new Error("Document not found");

  // Delete from Cloudinary
  await deleteFromCloudinary(doc.cloudinaryId);

  // Remove reference from trip
  await Trip.findByIdAndUpdate(doc.trip, { $pull: { documents: doc._id } });

  // Delete from DB
  await doc.deleteOne();

  return true;
};
