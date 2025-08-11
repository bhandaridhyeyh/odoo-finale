import { useState } from "react";
import { Plus, Calendar, MapPin, DollarSign, Upload, FileText, Clock, Edit3, Save } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const BuildItinerary = () => {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [tripBudget, setTripBudget] = useState("5000");
  
  const [itinerary, setItinerary] = useState([
    {
      day: 1,
      date: "March 15, 2024",
      location: "Paris, France",
      activities: [
        { time: "09:00", activity: "Arrival & Check-in", budget: 0, notes: "Hotel near Eiffel Tower" },
        { time: "14:00", activity: "Eiffel Tower Visit", budget: 150, notes: "Book tickets in advance" },
        { time: "18:00", activity: "Seine River Cruise", budget: 80, notes: "Sunset cruise recommended" },
      ]
    },
    {
      day: 2,
      date: "March 16, 2024", 
      location: "Paris, France",
      activities: [
        { time: "10:00", activity: "Louvre Museum", budget: 120, notes: "Book skip-the-line tickets" },
        { time: "15:00", activity: "Lunch at Café de Flore", budget: 60, notes: "Famous historic café" },
        { time: "17:00", activity: "Champs-Élysées Shopping", budget: 200, notes: "Budget for souvenirs" },
      ]
    }
  ]);

  const documents = [
    { name: "Passport_John_Doe.pdf", type: "ID", uploadDate: "2024-03-01" },
    { name: "Flight_Tickets_Paris.pdf", type: "Travel", uploadDate: "2024-03-02" },
    { name: "Hotel_Confirmation.pdf", type: "Accommodation", uploadDate: "2024-03-02" },
  ];

  const addNewDay = () => {
    const newDay = {
      day: itinerary.length + 1,
      date: `March ${15 + itinerary.length}, 2024`,
      location: "New Location",
      activities: [
        { time: "09:00", activity: "New Activity", budget: 0, notes: "" }
      ]
    };
    setItinerary([...itinerary, newDay]);
  };

  const addActivity = (dayIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.push({
      time: "12:00",
      activity: "New Activity",
      budget: 0,
      notes: ""
    });
    setItinerary(newItinerary);
  };

  const updateActivity = (dayIndex: number, activityIndex: number, field: string, value: string | number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities[activityIndex] = {
      ...newItinerary[dayIndex].activities[activityIndex],
      [field]: value
    };
    setItinerary(newItinerary);
  };

  const getTotalBudgetUsed = () => {
    return itinerary.reduce((total, day) => {
      return total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.budget, 0);
    }, 0);
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
                European Adventure 2024 • 7 days in Paris, Rome, Barcelona
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

              {/* Daily Itinerary */}
              {itinerary.map((day, dayIndex) => (
                <Card key={day.day}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Day {day.day} - {day.date}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingDay(editingDay === dayIndex ? null : dayIndex)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                    {editingDay === dayIndex && (
                      <div className="mt-4 space-y-2">
                        <Input
                          value={day.location}
                          onChange={(e) => {
                            const newItinerary = [...itinerary];
                            newItinerary[dayIndex].location = e.target.value;
                            setItinerary(newItinerary);
                          }}
                          placeholder="Location"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{day.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex gap-4 p-4 border rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[60px]">
                            <Clock className="w-4 h-4" />
                            {editingDay === dayIndex ? (
                              <Input
                                type="time"
                                value={activity.time}
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
                                  value={activity.activity}
                                  onChange={(e) => updateActivity(dayIndex, activityIndex, 'activity', e.target.value)}
                                  placeholder="Activity"
                                />
                                <Input
                                  type="number"
                                  value={activity.budget}
                                  onChange={(e) => updateActivity(dayIndex, activityIndex, 'budget', parseInt(e.target.value) || 0)}
                                  placeholder="Budget"
                                  className="w-32"
                                />
                                <Textarea
                                  value={activity.notes}
                                  onChange={(e) => updateActivity(dayIndex, activityIndex, 'notes', e.target.value)}
                                  placeholder="Notes"
                                  className="h-20"
                                />
                              </>
                            ) : (
                              <>
                                <div className="font-medium">{activity.activity}</div>
                                <div className="flex gap-2">
                                  <Badge variant="secondary">${activity.budget}</Badge>
                                </div>
                                {activity.notes && (
                                  <div className="text-sm text-muted-foreground">{activity.notes}</div>
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

              {/* Add New Day */}
              <Button
                variant="outline"
                onClick={addNewDay}
                className="w-full h-16 border-dashed border-2"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Day
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
                    {documents.map((doc, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium text-sm">{doc.name}</div>
                        <div className="text-xs text-muted-foreground">{doc.type}</div>
                        <div className="text-xs text-muted-foreground">Uploaded: {doc.uploadDate}</div>
                      </div>
                    ))}
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