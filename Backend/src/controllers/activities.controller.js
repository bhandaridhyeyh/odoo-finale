// src/controllers/activities.controller.js
import * as activityService from "../services/activity.service.js";

export const createActivity = async (req, res) => {
  try {
    const stopId = req.params.stopId;
    const activity = await activityService.createActivity(stopId, req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const stopId = req.params.stopId;
    const activities = await activityService.getActivitiesForStop(stopId);
    res.json(activities);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getActivity = async (req, res) => {
  try {
    const activity = await activityService.getActivityById(req.params.id);
    res.json(activity);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const activity = await activityService.updateActivity(req.params.id, req.body);
    res.json(activity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    await activityService.deleteActivity(req.params.id);
    res.json({ message: "Activity deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
