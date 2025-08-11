import * as tripService from "../services/trip.service.js";

export const createTrip = async (req, res) => {
  try {
    const trip = await tripService.createTrip(req.user._id, req.body);
    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await tripService.getUserTrips(req.user._id);
    res.json(trips);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTrip = async (req, res) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    res.json(trip);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const trip = await tripService.updateTrip(req.params.id, req.body);
    res.json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    await tripService.deleteTrip(req.params.id);
    res.json({ message: "Trip deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
