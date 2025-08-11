import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Calendar, MapPin, Users, FileText, Edit3, Trash2, Plus, Download, Share } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripsAPI } from "@/api/trips";
import { StopsAPI } from "@/api/stops";

const ViewItinerary = () => {
  const [params] = useSearchParams();
  const tripId = params.get("tripId");
  const [searchQuery, setSearchQuery] = useState("");
  const [trip, setTrip] = useState<any>(null);
  const [stops, setStops] = useState<any[]>([]);

  useEffect(() => {
    if (!tripId) return;
    TripsAPI.get(tripId).then(setTrip).catch(console.error);
    StopsAPI.list(tripId).then(setStops).catch(console.error);
  }, [tripId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary text-primary-foreground';
      case 'ongoing': return 'bg-success text-success-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {trip?.title || "Trip"}
                </h1>
                <Badge className={getStatusColor("upcoming")}>
                  Upcoming
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{trip?.description || ""}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{trip ? `${new Date(trip.startDate).toDateString()} - ${new Date(trip.endDate).toDateString()}` : ""}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{(trip?.collaborators?.length || 0) + 1} travelers</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="hero">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Trip
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search activities, locations, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Budget Overview */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">${trip?.budget || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">$0</div>
                      <div className="text-sm text-muted-foreground">Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">${trip?.budget || 0}</div>
                      <div className="text-sm text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Itinerary */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Day-wise Itinerary</CardTitle>
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Calendar View
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {stops.map((stop) => (
                      <div key={stop._id} className="border rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {stop.name} - {new Date(stop.date).toDateString()}
                            </h3>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{stop.location}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {(stop.activities || []).map((activity: any) => (
                            <div key={activity._id} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                              <div className="text-sm text-muted-foreground min-w-[60px]">
                                {activity.time}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{activity.name}</div>
                                {activity.description && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {activity.description}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-primary">
                                  ${activity.cost || 0}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Collaborators */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Collaborators
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(trip?.collaborators || []).map((c: any) => (
                      <div key={c} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-accent text-white">
                              U
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">Collaborator</div>
                            <div className="text-xs text-muted-foreground">{c}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {}}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Documents
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg text-sm text-muted-foreground">
                      Upload and manage your documents in Build Itinerary screen.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewItinerary;