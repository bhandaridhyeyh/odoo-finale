// src/models/Document.model.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    cloudinaryId: { type: String }, // public_id for deletion
    mimeType: { type: String },
    size: { type: Number },
  },
  { timestamps: true }
);

export const Document = mongoose.model("Document", documentSchema);
