import mongoose from "mongoose";

const stopSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  },
  { timestamps: true }
);

export const Stop = mongoose.model("Stop", stopSchema);
