// src/controllers/stops.controller.js
import * as stopService from "../services/stop.service.js";

export const createStop = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const stop = await stopService.createStop(tripId, req.body);
    res.status(201).json(stop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getStops = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const stops = await stopService.getStopsForTrip(tripId);
    res.json(stops);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getStop = async (req, res) => {
  try {
    const stop = await stopService.getStopById(req.params.id);
    res.json(stop);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateStop = async (req, res) => {
  try {
    const stop = await stopService.updateStop(req.params.id, req.body);
    res.json(stop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteStop = async (req, res) => {
  try {
    await stopService.deleteStop(req.params.id);
    res.json({ message: "Stop deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
