import * as tripService from "../services/trip.service.js";
import { Trip } from "../models/Trip.model.js";

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

export const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error("Error fetching user's trips:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPublicTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ isPublic: true })
      .populate("user", "firstName lastName avatarUrl isVerified"); // Add fields you want
    res.json(trips);
  } catch (err) {
    console.error("Error fetching public trips:", err);
    res.status(500).json({ message: "Server error" });
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

export const uploadCover = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const trip = await tripService.setCoverImage(req.params.id, req.file);
    res.json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addCollaborator = async (req, res) => {
  try {
    const { userId } = req.body;
    const trip = await tripService.addCollaborator(req.params.id, userId);
    res.json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeCollaborator = async (req, res) => {
  try {
    const { userId } = req.body;
    const trip = await tripService.removeCollaborator(req.params.id, userId);
    res.json(trip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
