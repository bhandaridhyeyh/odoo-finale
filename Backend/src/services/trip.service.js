import { Trip } from "../models/Trip.model.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "./cloudinary.service.js";

export const createTrip = async (userId, tripData) => {
  const trip = await Trip.create({ ...tripData, user: userId });
  return trip;
};

export const getUserTrips = async (userId) => {
  return await Trip.find({ user: userId }).populate("stops");
};

export const getTripById = async (tripId) => {
  return await Trip.findById(tripId).populate({ path: "stops", populate: { path: "activities" } });
};

export const updateTrip = async (tripId, updates) => {
  return await Trip.findByIdAndUpdate(tripId, updates, { new: true });
};

export const deleteTrip = async (tripId) => {
  return await Trip.findByIdAndDelete(tripId);
};

export const setCoverImage = async (tripId, file) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error("Trip not found");
  if (trip.coverCloudinaryId) await deleteFromCloudinary(trip.coverCloudinaryId);
  const result = await uploadBufferToCloudinary(file.buffer, `trips/${tripId}`, file.originalname);
  trip.image = result.secure_url;
  trip.coverCloudinaryId = result.public_id;
  await trip.save();
  return trip;
};

export const addCollaborator = async (tripId, userId) => {
  const trip = await Trip.findByIdAndUpdate(
    tripId,
    { $addToSet: { collaborators: userId } },
    { new: true }
  );
  if (!trip) throw new Error("Trip not found");
  return trip;
};

export const removeCollaborator = async (tripId, userId) => {
  const trip = await Trip.findByIdAndUpdate(
    tripId,
    { $pull: { collaborators: userId } },
    { new: true }
  );
  if (!trip) throw new Error("Trip not found");
  return trip;
};
