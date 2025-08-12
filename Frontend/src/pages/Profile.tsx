import { useState, useEffect } from "react";
import { User, Edit3, MapPin, Calendar, Camera, Settings, Award } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import TripCard from "@/components/ui/TripCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

interface ProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  isVerified?: boolean;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface Trip {
  _id: string;
  title: string;
  description: string;
  image?: string;
  duration?: string;
  travelers?: number;
  cost?: number;
  status?: "completed" | "ongoing";
  collaborators?: string[];
  isPublic?: boolean;
}

interface Achievement {
  name: string;
  description: string;
  icon: string;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchProfileAndTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch profile
        const profileRes = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);

        // Fetch all trips of this user (public + private)
        const tripsRes = await axios.get("http://localhost:5000/api/trips/my-trips", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserTrips(tripsRes.data); // assume data is array of trips

        // Set achievements as needed or leave empty
        setAchievements([]);
      } catch (err) {
        console.error("Failed to fetch profile or trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndTrips();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleTripClick = (id: string) => {
    console.log(`Navigate to trip ${id} itinerary`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8 text-center">Loading profile...</div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="p-8 text-center text-red-500">
          Failed to load profile data.
        </div>
      </Layout>
    );
  }

  const isProfileComplete = profile && profile.firstName && profile.lastName && profile.email;

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "";

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
                      {profile.avatarUrl ? (
                        <AvatarImage src={profile.avatarUrl} alt={fullName} />
                      ) : (
                        <AvatarFallback className="text-2xl bg-gradient-to-r from-primary to-accent text-white">
                          {fullName
                            ? fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                            : "?"}
                        </AvatarFallback>
                      )}
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
                      <h1 className="text-3xl font-bold text-foreground mb-2">{fullName}</h1>

                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit Profile"}
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
                          value={fullName}
                          onChange={(e) => {
                            const [firstName, lastName] = e.target.value.split(" ");
                            setProfile({ ...profile, firstName, lastName });
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Button variant="hero" onClick={handleSave}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>Joined in 2025</span>
                        </div>
                        <div className="flex items-center gap-1">📧 {profile.email}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground">Trips Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-accent">2</div>
                <div className="text-sm text-muted-foreground">Countries Visited</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-success">3000 km</div>
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

          {/* Tabs */}
          <Tabs defaultValue="trips" className="space-y-6">
            <TabsContent value="trips" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Previous Trips</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTrips.map((trip) => (
                  <TripCard
                    key={trip._id}
                    id={trip._id}
                    title={trip.title}
                    destination={trip.description}
                    image={trip.image || "/src/assets/hero-beach.jpg"}
                    duration={trip.duration || ""}
                    travelers={trip.travelers ?? 1}
                    cost={trip.cost ?? 0}
                    status={trip.status || "completed"}
                    collaborators={trip.collaborators || []}
                    onClick={handleTripClick}
                  />
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
