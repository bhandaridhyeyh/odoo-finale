import API from "./axios";

export interface StopPayload {
  name: string;
  location: string;
  date: string; // ISO date
}

export const StopsAPI = {
  create(tripId: string, payload: StopPayload) {
    return API.post(`/stops/${tripId}`, payload).then(r => r.data);
  },
  list(tripId: string) {
    return API.get(`/stops/${tripId}`).then(r => r.data);
  },
  get(id: string) {
    return API.get(`/stops/stop/${id}`).then(r => r.data);
  },
  update(id: string, payload: Partial<StopPayload>) {
    return API.put(`/stops/stop/${id}`, payload).then(r => r.data);
  },
  delete(id: string) {
    return API.delete(`/stops/stop/${id}`).then(r => r.data);
  }
}; 