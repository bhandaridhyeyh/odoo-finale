import { Trip } from "../models/Trip.model.js";

export const createTrip = async (userId, tripData) => {
  const trip = await Trip.create({ ...tripData, user: userId });
  return trip;
};

export const getUserTrips = async (userId) => {
  return await Trip.find({ user: userId }).populate("stops");
};

export const getTripById = async (tripId) => {
  return await Trip.findById(tripId).populate("stops");
};

export const updateTrip = async (tripId, updates) => {
  return await Trip.findByIdAndUpdate(tripId, updates, { new: true });
};

export const deleteTrip = async (tripId) => {
  return await Trip.findByIdAndDelete(tripId);
};
