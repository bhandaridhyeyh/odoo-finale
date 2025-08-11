import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  Upload,
  FileText,
  Clock,
  Edit3,
  GripVertical,
  Trash,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "../components/ui/combobox";

import { TripsAPI } from "@/api/trips";
import { StopsAPI } from "@/api/stops";
import { ActivitiesAPI } from "@/api/activities";
import { DocumentsAPI } from "@/api/documents";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

interface Activity {
  _id?: string;
  name: string;
  time: string;
  cost: number;
  description?: string;
  category: string;
  sectionId?: string;
}

interface Stop {
  _id: string;
  name: string;
  location: string;
  date: string;
  activities?: Activity[];
}

const popularIndianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
  "Lucknow", "Kanpur", "Nagpur", "Visakhapatnam", "Indore",
  "Thane", "Bhopal", "Patna", "Vadodara", "Ghaziabad"
];

const activityCategories = [
  "Sightseeing", "Food", "Transport", 
  "Accommodation", "Shopping", "Entertainment"
];

const BuildItinerary = () => {
  const [params] = useSearchParams();
  const tripId = params.get("tripId");

  const [tripTitle, setTripTitle] = useState("");
  const [tripBudget, setTripBudget] = useState("0");
  const [stops, setStops] = useState<Stop[]>([]);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [newStopData, setNewStopData] = useState({
    name: "",
    location: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: "",
    time: "12:00",
    cost: 0,
    category: "Sightseeing",
  });

  // Drag and drop hooks
  const { dragStart, dragOver, dragEnd, handleDrop } = useDragAndDrop<Stop>({
    items: stops,
    setItems: setStops,
    onReorder: async (reorderedStops) => {
      // API call to save new order would go here
    }
  });

  useEffect(() => {
    if (!tripId) return;

    // Load trip info
    TripsAPI.get(tripId)
      .then((t) => {
        setTripTitle(t.title);
        setTripBudget(String(t.budget || 0));
      })
      .catch(console.error);

    // Load stops with activities
    StopsAPI.list(tripId)
      .then(async (stopList: Stop[]) => {
        const stopsWithActivities = await Promise.all(
          stopList.map(async (stop) => {
            const activities = await ActivitiesAPI.list(stop._id);
            return { ...stop, activities };
          })
        );
        setStops(stopsWithActivities);
      })
      .catch(console.error);
  }, [tripId]);

  // Add new stop (quick add)
  const addQuickStop = async () => {
    if (!tripId) return;

    const today = new Date().toISOString().slice(0, 10);
    const newStop = await StopsAPI.create(tripId, {
      name: "New Stop",
      location: "Select location",
      date: today,
    });

    setStops((prev) => [...prev, { ...newStop, activities: [] }]);
  };

  // Add new stop with modal
  const handleSaveStop = async () => {
    if (!tripId) return;

    const newStop = await StopsAPI.create(tripId, {
      name: newStopData.name || "New Stop",
      location: newStopData.location || "Select location",
      date: newStopData.date,
    });

    // Add activities if any were created in the modal
    if (newActivity.name) {
      const createdActivity = await ActivitiesAPI.create(newStop._id, {
        name: newActivity.name,
        time: newActivity.time || "12:00",
        cost: newActivity.cost || 0,
        description: newActivity.description,
      });
      
      setStops((prev) => [...prev, { ...newStop, activities: [createdActivity] }]);
    } else {
      setStops((prev) => [...prev, { ...newStop, activities: [] }]);
    }

    setShowAddStopModal(false);
    setNewStopData({
      name: "",
      location: "",
      date: new Date().toISOString().slice(0, 10),
    });
    setNewActivity({
      name: "",
      time: "12:00",
      cost: 0,
      category: "Sightseeing",
    });
  };

  // Add new activity to stop
  const addActivity = async (stopIndex: number) => {
    const stop = stops[stopIndex];
    if (!stop) return;

    const newActivity = await ActivitiesAPI.create(stop._id, {
      name: "New Activity",
      time: "12:00",
      cost: 0,
      description: "",
    });

    const updatedStops = [...stops];
    updatedStops[stopIndex].activities = updatedStops[stopIndex].activities || [];
    updatedStops[stopIndex].activities!.push(newActivity);
    setStops(updatedStops);
  };

  // Update activity fields
  const updateActivity = async (
    stopIndex: number,
    activityIndex: number,
    field: keyof Activity,
    value: string | number
  ) => {
    const stop = stops[stopIndex];
    if (!stop || !stop.activities) return;
    const activity = stop.activities[activityIndex];
    if (!activity?._id) return;

    const updatedActivity = await ActivitiesAPI.update(activity._id, {
      [field]: value,
    } as any);

    const newStops = [...stops];
    newStops[stopIndex].activities![activityIndex] = updatedActivity;
    setStops(newStops);
  };

  // Delete activity
  const deleteActivity = async (stopIndex: number, activityIndex: number) => {
    const stop = stops[stopIndex];
    if (!stop || !stop.activities) return;
    const activity = stop.activities[activityIndex];
    if (!activity?._id) return;

    if (!confirm("Are you sure you want to delete this activity?")) return;

    await ActivitiesAPI.delete(activity._id);

    const newStops = [...stops];
    newStops[stopIndex].activities!.splice(activityIndex, 1);
    setStops(newStops);
  };

  // Delete stop
  const deleteStop = async (stopIndex: number) => {
    const stop = stops[stopIndex];
    if (!stop?._id) return;

    if (!confirm("Are you sure you want to delete this stop and all its activities?")) return;

    await StopsAPI.delete(stop._id);

    const newStops = [...stops];
    newStops.splice(stopIndex, 1);
    setStops(newStops);
  };

  // Calculate total budget used in all activities
  const getTotalBudgetUsed = () => {
    return stops.reduce((total, stop) => {
      const activities = stop.activities || [];
      return total + activities.reduce((acc, a) => acc + (a.cost || 0), 0);
    }, 0);
  };

  // Upload document handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!tripId) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await DocumentsAPI.upload(tripId, file);
      alert("Uploaded document");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    }
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
              <p className="text-xl text-muted-foreground">{tripTitle}</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => alert("Save Trip clicked - implement saving!")}
              >
                Save Trip
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
                      <div className="text-2xl font-bold text-primary">₹{tripBudget}</div>
                      <div className="text-sm text-muted-foreground">Total Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">₹{getTotalBudgetUsed()}</div>
                      <div className="text-sm text-muted-foreground">Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        ₹{parseInt(tripBudget) - getTotalBudgetUsed()}
                      </div>
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

              {/* Stops & Activities */}
              {stops.map((stop, stopIndex) => (
                <Card 
                  key={stop._id}
                  draggable
                  onDragStart={(e) => dragStart(e, stopIndex)}
                  onDragOver={(e) => dragOver(e, stopIndex)}
                  onDragEnd={dragEnd}
                  onDrop={(e) => handleDrop(e, stopIndex)}
                  className="relative group"
                >
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <Input
                          value={stop.name}
                          onChange={(e) => {
                            const newStops = [...stops];
                            newStops[stopIndex].name = e.target.value;
                            setStops(newStops);
                            // You would add API call to save this change
                          }}
                          className="border-none p-0 text-lg font-bold"
                          placeholder="Stop name"
                        />
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteStop(stopIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <Combobox
                        options={popularIndianCities}
                        value={stop.location}
                        onChange={(value) => {
                          const newStops = [...stops];
                          newStops[stopIndex].location = value;
                          setStops(newStops);
                          // You would add API call to save this change
                        }}
                        placeholder="Select location"
                        className="w-full max-w-xs"
                      />
                      <Input
                        type="date"
                        value={stop.date}
                        onChange={(e) => {
                          const newStops = [...stops];
                          newStops[stopIndex].date = e.target.value;
                          setStops(newStops);
                          // You would add API call to save this change
                        }}
                        className="w-auto"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(stop.activities || []).map((activity, activityIndex) => (
                        <div
                          key={activity._id || activityIndex}
                          className="flex gap-4 p-4 border rounded-lg group/activity"
                        >
                          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[60px]">
                            <Clock className="w-4 h-4" />
                            <Input
                              type="time"
                              value={activity.time || "12:00"}
                              onChange={(e) =>
                                updateActivity(stopIndex, activityIndex, "time", e.target.value)
                              }
                              className="w-20 h-8 text-xs"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex gap-2 items-start">
                              <Input
                                value={activity.name}
                                onChange={(e) =>
                                  updateActivity(stopIndex, activityIndex, "name", e.target.value)
                                }
                                placeholder="Activity name"
                                className="flex-1"
                              />
                              <Select
                                value={activity.category}
                                onValueChange={(value) =>
                                  updateActivity(stopIndex, activityIndex, "category", value)
                                }
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {activityCategories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                value={activity.cost || 0}
                                onChange={(e) =>
                                  updateActivity(
                                    stopIndex,
                                    activityIndex,
                                    "cost",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder="Budget"
                                className="w-32"
                              />
                              <Textarea
                                value={activity.description || ""}
                                onChange={(e) =>
                                  updateActivity(stopIndex, activityIndex, "description", e.target.value)
                                }
                                placeholder="Notes"
                                className="flex-1 h-20"
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteActivity(stopIndex, activityIndex)}
                            className="opacity-0 group-hover/activity:opacity-100 text-red-500 hover:text-red-700"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={() => addActivity(stopIndex)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Stop Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={addQuickStop}
                  className="h-16 border-dashed border-2 flex-1"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Quick Add Stop
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddStopModal(true)}
                  className="h-16 border-dashed border-2 flex-1"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Stop with Details
                </Button>
              </div>
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
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add Stop Modal */}
      <Dialog open={showAddStopModal} onOpenChange={setShowAddStopModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Stop</DialogTitle>
            <DialogDescription>
              Add a new city to your itinerary with all details
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* City Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Stop Name</Label>
                <Input
                  value={newStopData.name}
                  onChange={(e) => setNewStopData({...newStopData, name: e.target.value})}
                  placeholder="Enter stop name"
                />
              </div>
              <div>
                <Label htmlFor="date">Visit Date</Label>
                <Input
                  type="date"
                  value={newStopData.date}
                  onChange={(e) => setNewStopData({...newStopData, date: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label>City/Location</Label>
              <Combobox
                options={popularIndianCities}
                value={newStopData.location}
                onChange={(value) => setNewStopData({...newStopData, location: value})}
                placeholder="Search cities..."
              />
              <div className="mt-2 text-sm text-muted-foreground">
                Popular: {popularIndianCities.slice(0, 5).join(", ")}
              </div>
            </div>

            {/* Activities Section */}
            <div>
              <Label>Add First Activity (Optional)</Label>
              <div className="space-y-2 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Activity Name</Label>
                    <Input
                      value={newActivity.name}
                      onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                      placeholder="Activity name"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newActivity.category}
                      onValueChange={(value) => setNewActivity({...newActivity, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={newActivity.time}
                      onChange={(e) => setNewActivity({...newActivity, time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Cost (₹)</Label>
                    <Input
                      type="number"
                      value={newActivity.cost}
                      onChange={(e) => setNewActivity({...newActivity, cost: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={newActivity.description || ""}
                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                    placeholder="Any notes about this activity"
                  />
                </div>
              </div>
            </div>

            {/* Budget Preview */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Estimated Cost for this stop:</span>
                <span>₹{newActivity.cost || 0}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStopModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStop}>Save Stop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BuildItinerary;