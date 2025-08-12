// src/pages/BuildItinerary.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  Upload,
  FileText,
  Clock,
  Edit3,
  Trash2,
  Save,
  X,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TripsAPI } from "@/api/trips";
import { StopsAPI } from "@/api/stops";
import { ActivitiesAPI } from "@/api/activities";
import { DocumentsAPI } from "@/api/documents";
import DocumentUpload from "@/components/DocumentUpload";

type StopType = {
  _id?: string;
  name: string;
  location?: string;
  date?: string; // ISO
  activities?: ActivityType[];
};

type ActivityType = {
  _id?: string;
  name: string;
  time?: string;
  cost?: number;
  description?: string;
  stopId?: string;
};

type DocumentType = {
  _id?: string;
  filename: string;
  url?: string;
  tripId?: string;
};

export default function BuildItinerary() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const tripIdParam = params.get("tripId");

  // Trip state
  const [tripId, setTripId] = useState<string | null>(tripIdParam);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [budget, setBudget] = useState<number>(0);

  // Itinerary state
  const [stops, setStops] = useState<StopType[]>([]);
  const [documents, setDocuments] = useState<DocumentType[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [expandedStopIndex, setExpandedStopIndex] = useState<number | null>(null);
  const [activityModal, setActivityModal] = useState<{ stopIndex: number; activityIndex: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auth guard: require token (simple check)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // redirect to login - you can change to your login route
      navigate("/login");
    }
  }, [navigate]);

  // Fetch trip + stops + docs if editing an existing trip
  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    const load = async () => {
      try {
        const trip = await TripsAPI.get(tripId);
        setTitle(trip.title || "");
        setDescription(trip.description || "");
        setStartDate(trip.startDate ? trip.startDate.slice(0, 10) : "");
        setEndDate(trip.endDate ? trip.endDate.slice(0, 10) : "");
        setBudget(trip.budget || 0);

        const fetchedStops = await StopsAPI.list(tripId);
        // for each stop, fetch activities (StopsAPI.list may already embed activities in your backend - but we fetch to be safe)
        const stopsWithActivities: StopType[] = await Promise.all(
          fetchedStops.map(async (s: any) => {
            const acts = await ActivitiesAPI.list(s._id).catch(() => []);
            return { ...s, activities: acts || [] };
          })
        );
        setStops(stopsWithActivities);

        // fetch documents - document endpoint assumed to accept ?tripId
        const docs = await (await fetchDocuments(tripId));
        setDocuments(docs);
      } catch (err) {
        console.error(err);
        setError("Failed to load trip data.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  // Helper: fetch docs (DocumentsAPI currently exposes upload/delete; use generic fetch via API to /documents?tripId=... if you need)
  const fetchDocuments = async (tId: string) => {
    try {
      // DocumentsAPI may not have list; use raw API client if necessary
      // We assume /documents?tripId=... returns array
      // Using the same axios instance (API) - if you have DocumentsAPI.list, use that
      const res = await (await import("@/api/axios")).default.get(`/documents?tripId=${tId}`);
      return res.data;
    } catch (err) {
      console.warn("Could not fetch documents", err);
      return [];
    }
  };

  // Create or update trip
  const saveTrip = async () => {
    if (!title || !startDate || !endDate) {
      setError("Please provide title, start and end dates.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (!tripId) {
        const created = await TripsAPI.create({
          title,
          description,
          startDate,
          endDate,
          budget,
        });
        setTripId(created._id);
        // push query param so others can open the trip
        navigate(`?tripId=${created._id}`, { replace: true });
      } else {
        await TripsAPI.update(tripId, {
          title,
          description,
          startDate,
          endDate,
          budget,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save trip.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Stops CRUD ------------------ */

  const addStopLocal = () => {
    setStops((s) => [...s, { name: "New Stop", location: "", date: startDate || new Date().toISOString().slice(0, 10), activities: [] }]);
    // auto-expand new stop
    setExpandedStopIndex(stops.length);
  };

  const createStop = async (stopIndex: number) => {
    if (!tripId) {
      setError("Save the trip first to add stops.");
      return;
    }
    const stop = stops[stopIndex];
    try {
      const created = await StopsAPI.create(tripId, {
        name: stop.name,
        location: stop.location || "",
        date: stop.date || new Date().toISOString().slice(0, 10),
      });
      const newStops = [...stops];
      newStops[stopIndex] = { ...created, activities: stop.activities || [] };
      setStops(newStops);
    } catch (err) {
      console.error(err);
      setError("Failed to create stop.");
    }
  };

  const persistStopUpdate = async (stopIndex: number) => {
    const stop = stops[stopIndex];
    if (!stop._id) {
      await createStop(stopIndex);
      return;
    }
    try {
      const updated = await StopsAPI.update(stop._id as string, {
        name: stop.name,
        location: stop.location,
        date: stop.date,
      });
      const newStops = [...stops];
      newStops[stopIndex] = { ...updated, activities: stop.activities || [] };
      setStops(newStops);
    } catch (err) {
      console.error(err);
      setError("Failed to update stop.");
    }
  };

  const deleteStop = async (stopIndex: number) => {
    const stop = stops[stopIndex];
    if (stop._id) {
      try {
        await StopsAPI.delete(stop._id);
      } catch (err) {
        console.warn("delete stop failed on server", err);
      }
    }
    const newStops = [...stops];
    newStops.splice(stopIndex, 1);
    setStops(newStops);
    setExpandedStopIndex(null);
  };

  /* ------------------ Activities CRUD ------------------ */

  const addActivityLocal = (stopIndex: number) => {
    const newAct: ActivityType = { name: "New Activity", time: "12:00", cost: 0, description: "" };
    const newStops = [...stops];
    newStops[stopIndex].activities = newStops[stopIndex].activities ? [...newStops[stopIndex].activities!, newAct] : [newAct];
    setStops(newStops);
    // open modal for the newly added activity
    setTimeout(() => setActivityModal({ stopIndex, activityIndex: newStops[stopIndex].activities!.length - 1 }), 120);
  };

  const createActivity = async (stopIndex: number, activityIndex: number) => {
    const stop = stops[stopIndex];
    if (!stop._id) {
      setError("Save the stop first to add activities.");
      return;
    }
    const activity = stop.activities![activityIndex];
    try {
      const created = await ActivitiesAPI.create(stop._id as string, {
        name: activity.name,
        description: activity.description,
        time: activity.time,
        cost: activity.cost,
      });
      const newStops = [...stops];
      newStops[stopIndex].activities![activityIndex] = created;
      setStops(newStops);
    } catch (err) {
      console.error(err);
      setError("Failed to create activity.");
    }
  };

  const persistActivityUpdate = async (stopIndex: number, activityIndex: number) => {
    const activity = stops[stopIndex].activities![activityIndex];
    if (!activity._id) {
      await createActivity(stopIndex, activityIndex);
      return;
    }
    try {
      const updated = await ActivitiesAPI.update(activity._id as string, {
        name: activity.name,
        description: activity.description,
        time: activity.time,
        cost: activity.cost,
      });
      const newStops = [...stops];
      newStops[stopIndex].activities![activityIndex] = updated;
      setStops(newStops);
    } catch (err) {
      console.error(err);
      setError("Failed to update activity.");
    }
  };

  const deleteActivity = async (stopIndex: number, activityIndex: number) => {
    const activity = stops[stopIndex].activities![activityIndex];
    if (activity._id) {
      try {
        await ActivitiesAPI.delete(activity._id);
      } catch (err) {
        console.warn("server delete activity failed", err);
      }
    }
    const newStops = [...stops];
    newStops[stopIndex].activities!.splice(activityIndex, 1);
    setStops(newStops);
  };

  /* ------------------ Documents ------------------ */

  const uploadDocument = async (file: File) => {
    if (!tripId) {
      setError("Save the trip first to upload documents.");
      return;
    }
    setError(null);
    try {
      // optimistic UI: show filename while uploading
      const optimisticDoc: DocumentType = { filename: file.name, url: "", tripId };
      setDocuments((d) => [...d, optimisticDoc]);
      const created = await DocumentsAPI.upload(tripId, file);
      // replace optimistic entry with real one
      setDocuments((d) => d.map((x) => (x.filename === optimisticDoc.filename && !x._id ? created : x)));
    } catch (err) {
      console.error(err);
      setError("Document upload failed.");
      // remove optimistic doc if failed
      setDocuments((d) => d.filter((x) => x.filename !== file.name || (x as any)._id));
    }
  };

  const deleteDocument = async (docId: string) => {
    try {
      await DocumentsAPI.delete(docId);
      setDocuments((d) => d.filter((x) => x._id !== docId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete document.");
    }
  };

  /* ------------------ Small helpers ------------------ */

  const totalUsed = stops.reduce(
    (acc, s) => acc + (s.activities ? s.activities.reduce((a, act) => a + (act.cost || 0), 0) : 0),
    0
  );

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{tripId ? "Edit Trip" : "Create Trip"}</h1>
              <p className="text-sm text-muted-foreground">Build your day-wise itinerary and attach documents for your trip.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={saveTrip} variant="outline" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {tripId ? "Update Trip" : "Save Trip"}
              </Button>
              <Button onClick={() => { /* quick export placeholder */ }} variant="ghost">Preview</Button>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Trip details & documents */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader><CardTitle>Trip Details</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <Textarea placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  <div className="flex gap-2">
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                  <Input type="number" placeholder="Budget (₹)" value={budget} onChange={(e) => setBudget(Number(e.target.value) || 0)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign /> Budget Overview</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 text-center">
                    <div>
                      <div className="text-lg font-bold">₹{budget}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-warning">₹{totalUsed}</div>
                      <div className="text-xs text-muted-foreground">Used</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-success">₹{Math.max(0, budget - totalUsed)}</div>
                      <div className="text-xs text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2"><FileText /> Documents</CardTitle>

                  {/* Make sure input has an id and label points to it */}
                  <input
                    id="document-upload-input"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        Array.from(files).forEach(file => uploadDocument(file));
                      }
                      e.currentTarget.value = "";
                    }}
                    className="hidden"
                  />

                  <Button asChild variant="outline" size="sm">
                    <label htmlFor="document-upload-input" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </label>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {documents.length === 0 && <div className="text-sm text-muted-foreground">No documents uploaded yet.</div>}
                    {documents.map((d, i) => (
                      <motion.div key={d._id || d.filename + i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-center p-2 border rounded">
                        <a href={d.url || "#"} target="_blank" rel="noreferrer" className="text-sm truncate">
                          {d.filename}
                        </a>
                        <div className="flex gap-2">
                          {d._id ? <a href={d.url} target="_blank" rel="noreferrer"><Button variant="ghost" size="sm"><DownloadIcon /></Button></a> : null}
                          {d._id ? <Button variant="ghost" size="sm" onClick={() => d._id && deleteDocument(d._id)}><Trash2 className="w-4 h-4" /></Button> : <span className="text-xs text-muted-foreground">Uploading...</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Stops & Activities */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Day-wise Itinerary</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={addStopLocal}><Plus className="w-4 h-4" /> Add Stop</Button>
                  <Button variant="ghost" onClick={() => { setStops([]); setDocuments([]); }} >Clear</Button>
                </div>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {stops.map((stop, sIndex) => (
                    <motion.div key={stop._id || sIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                      <Card>
                        <CardHeader className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-10 h-10 text-primary" />
                              <Input value={stop.name} onChange={(e) => {
                                const newStops = [...stops];
                                newStops[sIndex].name = e.target.value;
                                setStops(newStops);
                              }} className="w-48" />
                              <Input type="date" value={stop.date || ""} onChange={(e) => {
                                const newStops = [...stops];
                                newStops[sIndex].date = e.target.value;
                                setStops(newStops);
                              }} />
                              <Input value={stop.location} placeholder="Location" onChange={(e) => {
                                const newStops = [...stops];
                                newStops[sIndex].location = e.target.value;
                                setStops(newStops);
                              }} />
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              {stop._id ? <Badge className="bg-success text-success-foreground">Saved</Badge> : <Badge className="bg-muted text-muted-foreground">Not saved</Badge>}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 items-end">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => persistStopUpdate(sIndex)}><SaveIcon /> Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => setExpandedStopIndex(expandedStopIndex === sIndex ? null : sIndex)}>
                                {expandedStopIndex === sIndex ? "Collapse" : "Expand"}
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => deleteStop(sIndex)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </CardHeader>

                        <AnimatePresence>
                          {expandedStopIndex === sIndex && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                              <CardContent>
                                <div className="space-y-3">
                                  {(stop.activities || []).map((act, aIndex) => (
                                    <motion.div key={act._id || aIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="p-3 border rounded-md flex flex-col gap-2">
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <Input type="time" value={act.time || ""} onChange={(e) => {
                                          const newStops = [...stops];
                                          newStops[sIndex].activities![aIndex].time = e.target.value;
                                          setStops(newStops);
                                        }} className="w-28" />
                                        <Input value={act.name} onChange={(e) => {
                                          const newStops = [...stops];
                                          newStops[sIndex].activities![aIndex].name = e.target.value;
                                          setStops(newStops);
                                        }} />
                                        <Input type="number" className="w-28" value={act.cost || 0} onChange={(e) => {
                                          const newStops = [...stops];
                                          newStops[sIndex].activities![aIndex].cost = Number(e.target.value || 0);
                                          setStops(newStops);
                                        }} />
                                        <div className="ml-auto flex gap-2">
                                          <Button size="sm" variant="outline" onClick={() => persistActivityUpdate(sIndex, aIndex)}><SaveIcon /></Button>
                                          <Button size="sm" variant="ghost" onClick={() => deleteActivity(sIndex, aIndex)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                      </div>
                                      <Textarea placeholder="Notes" value={act.description || ""} onChange={(e) => {
                                        const newStops = [...stops];
                                        newStops[sIndex].activities![aIndex].description = e.target.value;
                                        setStops(newStops);
                                      }} />
                                    </motion.div>
                                  ))}

                                  <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => addActivityLocal(sIndex)}><Plus className="w-4 h-4 mr-1" /> Add Activity</Button>
                                  </div>
                                </div>
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        </div>
      </div>

      {/* Activity modal placeholder (if you want a modal view) */}
      <AnimatePresence>
        {activityModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-lg w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Activity</h3>
                <Button variant="ghost" onClick={() => setActivityModal(null)}><X /></Button>
              </div>
              {/* Render editable fields for activity */}
              {(() => {
                const { stopIndex, activityIndex } = activityModal;
                const stop = stops[stopIndex];
                const activity = stop?.activities?.[activityIndex];
                if (!activity) return <div className="text-sm text-muted-foreground">Activity not found</div>;
                return (
                  <div className="space-y-3">
                    <Input value={activity.name} onChange={(e) => {
                      const newStops = [...stops];
                      newStops[stopIndex].activities![activityIndex].name = e.target.value;
                      setStops(newStops);
                    }} />
                    <Input type="time" value={activity.time || ""} onChange={(e) => {
                      const newStops = [...stops];
                      newStops[stopIndex].activities![activityIndex].time = e.target.value;
                      setStops(newStops);
                    }} />
                    <Input type="number" value={activity.cost || 0} onChange={(e) => {
                      const newStops = [...stops];
                      newStops[stopIndex].activities![activityIndex].cost = Number(e.target.value || 0);
                      setStops(newStops);
                    }} />
                    <Textarea value={activity.description || ""} onChange={(e) => {
                      const newStops = [...stops];
                      newStops[stopIndex].activities![activityIndex].description = e.target.value;
                      setStops(newStops);
                    }} />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setActivityModal(null)}>Close</Button>
                      <Button onClick={() => { persistActivityUpdate(stopIndex, activityIndex); setActivityModal(null); }}>Save</Button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

/* small inline icons for buttons where I referenced DownloadIcon/SaveIcon above */
function DownloadIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l4-4m-4 4-4-4M21 21H3" /></svg>;
}
function SaveIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13v6h14v-6M5 9l7-6 7 6M12 3v6" /></svg>;
}
