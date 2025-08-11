import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    image: { type: String }, // optional trip cover image
    isPublic: { type: Boolean, default: false },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    budget: { type: Number, default: 0 },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
    stops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stop" }],
  },
  { timestamps: true }
);

export const Trip = mongoose.model("Trip", tripSchema);
