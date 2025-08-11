import API from "./axios";

export interface ActivityPayload {
  name: string;
  description?: string;
  time?: string;
  cost?: number;
}

export const ActivitiesAPI = {
  create(stopId: string, payload: ActivityPayload) {
    return API.post(`/activities/${stopId}`, payload).then(r => r.data);
  },
  list(stopId: string) {
    return API.get(`/activities/${stopId}`).then(r => r.data);
  },
  get(id: string) {
    return API.get(`/activities/activity/${id}`).then(r => r.data);
  },
  update(id: string, payload: Partial<ActivityPayload>) {
    return API.put(`/activities/activity/${id}`, payload).then(r => r.data);
  },
  delete(id: string) {
    return API.delete(`/activities/activity/${id}`).then(r => r.data);
  }
}; 