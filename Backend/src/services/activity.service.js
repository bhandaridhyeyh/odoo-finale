// src/services/activity.service.js
import { Activity } from "../models/Activity.model.js";
import { Stop } from "../models/Stop.model.js";

export const createActivity = async (stopId, activityData) => {
  const activity = await Activity.create({ ...activityData, stop: stopId });
  await Stop.findByIdAndUpdate(stopId, { $push: { activities: activity._id } });
  return activity;
};

export const getActivitiesForStop = async (stopId) => Activity.find({ stop: stopId });

export const getActivityById = async (id) => Activity.findById(id);

export const updateActivity = async (id, updates) => Activity.findByIdAndUpdate(id, updates, { new: true });

export const deleteActivity = async (id) => {
  const activity = await Activity.findById(id);
  if (!activity) throw new Error("Activity not found");
  await Stop.findByIdAndUpdate(activity.stop, { $pull: { activities: activity._id } });
  await activity.remove();
  return true;
};
