import API from "./axios";

export const DocumentsAPI = {
  upload(tripId: string, file: File) {
    const form = new FormData();
    form.append("file", file);
    form.append("tripId", tripId);
    return API.post("/documents", form, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);
  },
  delete(id: string) {
    return API.delete(`/documents/${id}`).then(r => r.data);
  }
}; 