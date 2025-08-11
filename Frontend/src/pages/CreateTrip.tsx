import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Globe, Lock, Plus, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TripsAPI } from "@/api/trips";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedPlaces = [
    { name: "Santorini, Greece", type: "Island Paradise", rating: 4.8 },
    { name: "Tokyo, Japan", type: "Cultural Experience", rating: 4.9 },
    { name: "Paris, France", type: "Romantic City", rating: 4.7 },
    { name: "Bali, Indonesia", type: "Tropical Escape", rating: 4.6 },
    { name: "Swiss Alps", type: "Adventure", rating: 4.9 },
    { name: "New York, USA", type: "Urban Experience", rating: 4.5 },
  ];

  const activities = [
    { name: "Sunset Photography Tour", duration: "3 hours", price: "$120" },
    { name: "Local Cooking Class", duration: "4 hours", price: "$85" },
    { name: "Historical Walking Tour", duration: "2 hours", price: "$45" },
    { name: "Adventure Sports Package", duration: "Full day", price: "$200" },
    { name: "Wine Tasting Experience", duration: "3 hours", price: "$95" },
    { name: "Cultural Museum Visit", duration: "2 hours", price: "$30" },
  ];

  const addCollaborator = () => {
    setCollaborators([...collaborators, `Collaborator ${collaborators.length + 1}`]);
  };

  const removeCollaborator = (index: number) => {
    setCollaborators(collaborators.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!title || !startDate || !endDate) return;
    setLoading(true);
    try {
      const trip = await TripsAPI.create({
        title,
        description: selectedPlace,
        startDate,
        endDate,
        isPublic,
      });
      navigate(`/build-itinerary?tripId=${trip._id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Create Your Perfect Trip
            </h1>
            <p className="text-xl text-muted-foreground">
              Plan an amazing adventure with friends and family
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Trip Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="trip-name">Trip Name</Label>
                    <Input
                      id="trip-name"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., European Adventure 2024"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="destination">Primary Destination</Label>
                    <Input
                      id="destination"
                      placeholder="Where would you like to go?"
                      value={selectedPlace}
                      onChange={(e) => setSelectedPlace(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  {/* Privacy Toggle */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {isPublic ? (
                        <Globe className="w-5 h-5 text-primary" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="font-medium">
                          {isPublic ? "Public Trip" : "Private Trip"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {isPublic
                            ? "Other users can see and get inspired by your trip"
                            : "Only you and collaborators can see this trip"}
                        </div>
                      </div>
                    </div>
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>
                </CardContent>
              </Card>

              {/* Collaborators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Travel Companions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collaborators.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {collaborators.map((collaborator, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2"
                          >
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {collaborator.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{collaborator}</span>
                            <button
                              onClick={() => removeCollaborator(index)}
                              className="text-muted-foreground hover:text-destructive ml-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={addCollaborator}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Travel Companion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suggestions Sidebar */}
            <div className="space-y-6">
              {/* Suggested Places */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggested Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestedPlaces.slice(0, 4).map((place, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedPlace(place.name)}
                      >
                        <div className="font-medium text-sm">{place.name}</div>
                        <div className="text-xs text-muted-foreground">{place.type}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-warning">★</span>
                          <span className="text-xs">{place.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.slice(0, 3).map((activity, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium text-sm">{activity.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.duration} • {activity.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button variant="outline" size="lg">
              Save as Draft
            </Button>
            <Button variant="hero" size="lg" onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : (
                <>
                  Build Itinerary
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;