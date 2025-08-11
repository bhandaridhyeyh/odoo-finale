import API from "./axios";

export interface TripPayload {
  title: string;
  description?: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  isPublic?: boolean;
  budget?: number;
  image?: string;
}

export const TripsAPI = {
  create(payload: TripPayload) {
    return API.post("/trips", payload).then(r => r.data);
  },
  list() {
    return API.get("/trips").then(r => r.data);
  },
  get(id: string) {
    return API.get(`/trips/${id}`).then(r => r.data);
  },
  update(id: string, payload: Partial<TripPayload>) {
    return API.put(`/trips/${id}`, payload).then(r => r.data);
  },
  delete(id: string) {
    return API.delete(`/trips/${id}`).then(r => r.data);
  }
}; 