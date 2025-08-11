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
  },
  uploadCover(id: string, file: File) {
    const form = new FormData();
    form.append("file", file);
    return API.post(`/trips/${id}/cover`, form, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);
  },
  addCollaborator(id: string, userId: string) {
    return API.post(`/trips/${id}/collaborators`, { userId }).then(r => r.data);
  },
  removeCollaborator(id: string, userId: string) {
    return API.delete(`/trips/${id}/collaborators`, { data: { userId } }).then(r => r.data);
  }
}; 