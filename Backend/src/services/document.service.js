// src/services/document.service.js
import { Document } from "../models/Document.model.js";
import { Trip } from "../models/Trip.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "./cloudinary.service.js";

export const uploadDocument = async ({ fileBuffer, originalname, mimetype, size, uploadedById, tripId }) => {
  const upload = await uploadBufferToCloudinary(fileBuffer, `trips/${tripId}`);
  const doc = await Document.create({
    trip: tripId,
    uploadedBy: uploadedById,
    filename: originalname,
    url: upload.secure_url,
    cloudinaryId: upload.public_id,
    mimeType: mimetype,
    size,
  });
  // attach to trip
  await Trip.findByIdAndUpdate(tripId, { $push: { documents: doc._id } });
  return doc;
};

export const deleteDocument = async (docId) => {
  const doc = await Document.findById(docId);
  if (!doc) throw new Error("Document not found");
  await deleteFromCloudinary(doc.cloudinaryId);
  await Trip.findByIdAndUpdate(doc.trip, { $pull: { documents: doc._id } });
  await doc.remove();
  return true;
};
