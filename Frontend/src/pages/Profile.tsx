import { useState } from "react";
import { User, Edit3, MapPin, Calendar, Users, Camera, Settings, Award } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import TripCard from "@/components/ui/TripCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Travel enthusiast and adventure seeker. Love exploring new cultures and cuisines around the world.",
    joinDate: "March 2023",
    tripsCompleted: 8,
    countriesVisited: 15,
    totalDistance: "45,230 km",
  });

  const userTrips = [
    {
      id: "1",
      title: "European Grand Tour",
      destination: "Paris, Rome, Barcelona",
      image: "/src/assets/hero-beach.jpg",
      duration: "14 days",
      travelers: 4,
      cost: 8500,
      status: 'completed' as const,
      collaborators: ["Alice Smith", "Bob Johnson", "Charlie Brown"],
    },
    {
      id: "2",
      title: "Swiss Alps Adventure", 
      destination: "Zurich, Interlaken, Zermatt",
      image: "/src/assets/destination-mountains.jpg",
      duration: "7 days",
      travelers: 2,
      cost: 3200,
      status: 'completed' as const,
      collaborators: ["David Wilson"],
    },
    {
      id: "3",
      title: "Tokyo Culture Trip",
      destination: "Tokyo, Kyoto, Osaka",
      image: "/src/assets/destination-city.jpg",
      duration: "10 days",
      travelers: 3,
      cost: 4500,
      status: 'ongoing' as const,
      collaborators: ["Emma Davis", "Frank Miller"],
    },
  ];

  const achievements = [
    { name: "First Trip", description: "Completed your first trip", icon: "🎯" },
    { name: "Frequent Traveler", description: "Visited 10+ countries", icon: "✈️" },
    { name: "Budget Master", description: "Stayed under budget 5 times", icon: "💰" },
    { name: "Social Explorer", description: "Traveled with 20+ collaborators", icon: "👥" },
  ];

  const handleTripClick = (id: string) => {
    console.log(`Navigate to trip ${id} itinerary`);
  };

  const isProfileComplete = profile.name && profile.email && profile.phone && profile.location && profile.bio;

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src="/placeholder-avatar.jpg" alt={profile.name} />
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-primary to-accent text-white">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-white"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  {!isProfileComplete && (
                    <Badge variant="destructive" className="text-xs">
                      Profile Incomplete
                    </Badge>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{profile.name}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                      <Button variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                          placeholder="Tell us about yourself and your travel style..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Button variant="hero" onClick={() => setIsEditing(false)}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-muted-foreground">{profile.bio}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>Joined {profile.joinDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📧 {profile.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📱 {profile.phone}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{profile.tripsCompleted}</div>
                <div className="text-sm text-muted-foreground">Trips Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-accent">{profile.countriesVisited}</div>
                <div className="text-sm text-muted-foreground">Countries Visited</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-success">{profile.totalDistance}</div>
                <div className="text-sm text-muted-foreground">Distance Traveled</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-warning">4.9</div>
                <div className="text-sm text-muted-foreground">Trip Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Complete Profile Banner */}
          {!isProfileComplete && (
            <Card className="mb-8 border-warning bg-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-warning" />
                    <div>
                      <h3 className="font-semibold text-foreground">Complete Your Profile</h3>
                      <p className="text-muted-foreground text-sm">
                        Add more details to help fellow travelers get to know you better
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs for Trips and Achievements */}
          <Tabs defaultValue="trips" className="space-y-6">
            <TabsList>
              <TabsTrigger value="trips">My Trips</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="trips" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Previous Trips</h2>
                <Button variant="outline">View All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    {...trip}
                    onClick={handleTripClick}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Travel Achievements</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold text-foreground">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;