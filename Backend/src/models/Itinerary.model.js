import mongoose from "mongoose";
const itinerarySchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  day: Number,
  activities: [String],
  notes: String,
  budget: Number,
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
});
export default mongoose.model("Itinerary", itinerarySchema);