import API from "./axios";

export interface ActivityPayload {
  name: string;
  description?: string;
  time?: string;
  cost?: number;
  sectionId?: string;  // add if your frontend uses it
}

export const ActivitiesAPI = {
  create(stopId: string, payload: ActivityPayload) {
    // Create new activity for a stop
    return API.post(`/stops/${stopId}/activities`, payload).then((r) => r.data);
  },

  list(stopId: string) {
    // List activities for a stop
    return API.get(`/stops/${stopId}/activities`).then((r) => r.data);
  },

  get(id: string) {
    // Get single activity by ID
    return API.get(`/activities/${id}`).then((r) => r.data);
  },

  update(id: string, payload: Partial<ActivityPayload>) {
    // Update single activity by ID
    return API.put(`/activities/${id}`, payload).then((r) => r.data);
  },

  delete(id: string) {
    // Delete activity by ID
    return API.delete(`/activities/${id}`).then((r) => r.data);
  },
};
