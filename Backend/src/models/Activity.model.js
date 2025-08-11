import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    stop: { type: mongoose.Schema.Types.ObjectId, ref: "Stop", required: true },
    name: { type: String, required: true },
    description: { type: String },
    time: { type: String }, // e.g. "10:30 AM"
    cost: { type: Number },
  },
  { timestamps: true }
);

export const Activity = mongoose.model("Activity", activitySchema);
