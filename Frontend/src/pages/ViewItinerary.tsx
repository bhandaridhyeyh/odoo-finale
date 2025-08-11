import { useState } from "react";
import { Search, Calendar, MapPin, Users, FileText, Edit3, Trash2, Plus, Download, Share } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewItinerary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const tripInfo = {
    title: "European Grand Tour",
    destination: "Paris, Rome, Barcelona",
    duration: "14 days",
    dates: "March 15 - March 28, 2024",
    status: "upcoming",
    budget: {
      total: 8500,
      used: 6750,
      remaining: 1750,
    },
  };

  const collaborators = [
    { id: "1", name: "Alice Smith", email: "alice@example.com", role: "Co-Planner", avatar: "AS" },
    { id: "2", name: "Bob Johnson", email: "bob@example.com", role: "Traveler", avatar: "BJ" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Traveler", avatar: "CB" },
  ];

  const documents = [
    { id: "1", name: "Flight_Tickets_Group.pdf", type: "Travel", size: "2.3 MB", uploadDate: "March 1, 2024" },
    { id: "2", name: "Hotel_Confirmations.pdf", type: "Accommodation", size: "1.8 MB", uploadDate: "March 2, 2024" },
    { id: "3", name: "Passports_Scanned.pdf", type: "ID", size: "4.1 MB", uploadDate: "March 1, 2024" },
    { id: "4", name: "Travel_Insurance.pdf", type: "Insurance", size: "1.2 MB", uploadDate: "March 3, 2024" },
  ];

  const itinerary = [
    {
      day: 1,
      date: "March 15, 2024",
      location: "Paris, France", 
      activities: [
        { id: "1", time: "09:00", activity: "Arrival & Hotel Check-in", budget: 0, notes: "Hotel near Eiffel Tower" },
        { id: "2", time: "14:00", activity: "Eiffel Tower Visit", budget: 150, notes: "Book tickets in advance" },
        { id: "3", time: "18:00", activity: "Seine River Cruise", budget: 80, notes: "Sunset cruise recommended" },
      ]
    },
    {
      day: 2,
      date: "March 16, 2024",
      location: "Paris, France",
      activities: [
        { id: "4", time: "10:00", activity: "Louvre Museum", budget: 120, notes: "Book skip-the-line tickets" },
        { id: "5", time: "15:00", activity: "Lunch at Café de Flore", budget: 60, notes: "Famous historic café" },
        { id: "6", time: "17:00", activity: "Champs-Élysées Shopping", budget: 200, notes: "Budget for souvenirs" },
      ]
    },
    {
      day: 3,
      date: "March 17, 2024",
      location: "Paris → Rome",
      activities: [
        { id: "7", time: "08:00", activity: "Flight to Rome", budget: 250, notes: "Flight AF1234" },
        { id: "8", time: "13:00", activity: "Hotel Check-in Rome", budget: 0, notes: "Hotel near Colosseum" },
        { id: "9", time: "16:00", activity: "Colosseum Tour", budget: 100, notes: "Guided tour booked" },
      ]
    },
  ];

  const removeCollaborator = (id: string) => {
    console.log(`Remove collaborator: ${id}`);
  };

  const deleteDocument = (id: string) => {
    console.log(`Delete document: ${id}`);
  };

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
                  {tripInfo.title}
                </h1>
                <Badge className={getStatusColor(tripInfo.status)}>
                  {tripInfo.status.charAt(0).toUpperCase() + tripInfo.status.slice(1)}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{tripInfo.destination}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{tripInfo.dates}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{collaborators.length} travelers</span>
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
                      <div className="text-2xl font-bold text-primary">${tripInfo.budget.total}</div>
                      <div className="text-sm text-muted-foreground">Total Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warning">${tripInfo.budget.used}</div>
                      <div className="text-sm text-muted-foreground">Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">${tripInfo.budget.remaining}</div>
                      <div className="text-sm text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                  <div className="mt-4 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(tripInfo.budget.used / tripInfo.budget.total) * 100}%` }}
                    />
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
                    {itinerary.map((day) => (
                      <div key={day.day} className="border rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              Day {day.day} - {day.date}
                            </h3>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{day.location}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {day.activities.map((activity) => (
                            <div key={activity.id} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                              <div className="text-sm text-muted-foreground min-w-[60px]">
                                {activity.time}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{activity.activity}</div>
                                {activity.notes && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {activity.notes}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-primary">
                                  ${activity.budget}
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
                    {collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-accent text-white">
                              {collaborator.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{collaborator.name}</div>
                            <div className="text-xs text-muted-foreground">{collaborator.role}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCollaborator(collaborator.id)}
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
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{doc.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {doc.type} • {doc.size}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {doc.uploadDate}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteDocument(doc.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
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