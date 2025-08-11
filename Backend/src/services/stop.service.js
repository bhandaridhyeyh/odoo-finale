// src/services/stop.service.js
import { Stop } from "../models/Stop.model.js";
import { Trip } from "../models/Trip.model.js";

export const createStop = async (tripId, stopData) => {
  const stop = await Stop.create({ ...stopData, trip: tripId });
  await Trip.findByIdAndUpdate(tripId, { $push: { stops: stop._id } });
  return stop;
};

export const getStopsForTrip = async (tripId) => {
  return Stop.find({ trip: tripId }).populate("activities");
};

export const getStopById = async (id) => Stop.findById(id).populate("activities");

export const updateStop = async (id, updates) => Stop.findByIdAndUpdate(id, updates, { new: true });

export const deleteStop = async (id) => {
  const stop = await Stop.findById(id);
  if (!stop) throw new Error("Stop not found");
  await Trip.findByIdAndUpdate(stop.trip, { $pull: { stops: stop._id } });
  await stop.remove();
  return true;
};
