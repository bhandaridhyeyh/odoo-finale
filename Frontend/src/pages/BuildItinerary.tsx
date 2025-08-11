import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Calendar, MapPin, DollarSign, Upload, FileText, Clock, Edit3, Save } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TripsAPI } from "@/api/trips";
import { StopsAPI } from "@/api/stops";
import { ActivitiesAPI } from "@/api/activities";
import { DocumentsAPI } from "@/api/documents";

const BuildItinerary = () => {
  const [params] = useSearchParams();
  const tripId = params.get("tripId");
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [tripBudget, setTripBudget] = useState("0");
  const [tripTitle, setTripTitle] = useState("");
  const [stops, setStops] = useState<any[]>([]);

  useEffect(() => {
    if (!tripId) return;
    TripsAPI.get(tripId).then((t) => {
      setTripTitle(t.title);
      setTripBudget(String(t.budget || 0));
    }).catch(console.error);
    StopsAPI.list(tripId).then(setStops).catch(console.error);
  }, [tripId]);

  const addStop = async () => {
    if (!tripId) return;
    const today = new Date().toISOString().slice(0, 10);
    const stop = await StopsAPI.create(tripId, { name: "New Stop", location: "", date: today });
    setStops((prev) => [...prev, stop]);
  };

  const addActivity = async (stopIndex: number) => {
    const stop = stops[stopIndex];
    const activity = await ActivitiesAPI.create(stop._id, { name: "New Activity", time: "12:00", cost: 0 });
    const updated = [...stops];
    if (!updated[stopIndex].activities) updated[stopIndex].activities = [];
    updated[stopIndex].activities.push(activity);
    setStops(updated);
  };

  const updateActivity = async (dayIndex: number, activityIndex: number, field: string, value: string | number) => {
    const stop = stops[dayIndex];
    const activity = stop.activities[activityIndex];
    const updated = await ActivitiesAPI.update(activity._id, { [field]: value } as any);
    const newStops = [...stops];
    newStops[dayIndex].activities[activityIndex] = updated;
    setStops(newStops);
  };

  const getTotalBudgetUsed = () => {
    return stops.reduce((total, stop) => {
      const activities = stop.activities || [];
      return total + activities.reduce((acc: number, a: any) => acc + (a.cost || 0), 0);
    }, 0);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!tripId) return;
    const file = e.target.files?.[0];
    if (!file) return;
    await DocumentsAPI.upload(tripId, file);
    alert("Uploaded document");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Build Your Itinerary
              </h1>
              <p className="text-xl text-muted-foreground">
                {tripTitle}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="hero" size="lg">
                Publish Trip
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Itinerary */}
            <div className="lg:col-span-3 space-y-6">
              {/* Budget Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Budget Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">${tripBudget}</div>
                      <div className="text-sm text-muted-foreground">Total Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">${getTotalBudgetUsed()}</div>
                      <div className="text-sm text-muted-foreground">Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">${parseInt(tripBudget) - getTotalBudgetUsed()}</div>
                      <div className="text-sm text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="budget">Update Total Budget</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={tripBudget}
                      onChange={(e) => setTripBudget(e.target.value)}
                      className="mt-2 max-w-xs"
                      placeholder="Enter total budget"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Daily Itinerary (mapped to stops) */}
              {stops.map((stop, dayIndex) => (
                <Card key={stop._id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {stop.name} - {new Date(stop.date).toDateString()}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingDay(editingDay === dayIndex ? null : dayIndex)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{stop.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(stop.activities || []).map((activity: any, activityIndex: number) => (
                        <div key={activity._id || activityIndex} className="flex gap-4 p-4 border rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[60px]">
                            <Clock className="w-4 h-4" />
                            {editingDay === dayIndex ? (
                              <Input
                                type="time"
                                value={activity.time || "12:00"}
                                onChange={(e) => updateActivity(dayIndex, activityIndex, 'time', e.target.value)}
                                className="w-20 h-8 text-xs"
                              />
                            ) : (
                              activity.time
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            {editingDay === dayIndex ? (
                              <>
                                <Input
                                  value={activity.name}
                                  onChange={(e) => updateActivity(dayIndex, activityIndex, 'name', e.target.value)}
                                  placeholder="Activity"
                                />
                                <Input
                                  type="number"
                                  value={activity.cost || 0}
                                  onChange={(e) => updateActivity(dayIndex, activityIndex, 'cost', parseInt(e.target.value) || 0)}
                                  placeholder="Budget"
                                  className="w-32"
                                />
                                <Textarea
                                  value={activity.description || ''}
                                  onChange={(e) => updateActivity(dayIndex, activityIndex, 'description', e.target.value)}
                                  placeholder="Notes"
                                  className="h-20"
                                />
                              </>
                            ) : (
                              <>
                                <div className="font-medium">{activity.name}</div>
                                <div className="flex gap-2">
                                  <Badge variant="secondary">${activity.cost || 0}</Badge>
                                </div>
                                {activity.description && (
                                  <div className="text-sm text-muted-foreground">{activity.description}</div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => addActivity(dayIndex)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Stop */}
              <Button
                variant="outline"
                onClick={addStop}
                className="w-full h-16 border-dashed border-2"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Day/Stop
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Input type="file" onChange={handleUpload} />
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Calendar View
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Import from Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuildItinerary;