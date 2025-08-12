import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Heart, BookOpen, Users, MapPin, Star, Eye } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filterBy, setFilterBy] = useState("all");
  const [trips, setTrips] = useState([]);

  // Static fallback data
  const fallbackTrips = [
    {
      id: "1",
      title: "Solo Backpacking Through Southeast Asia",
      author: { name: "Sarah Chen", avatar: "SC", verified: true },
      destination: "Thailand, Vietnam, Cambodia",
      duration: "30 days",
      budget: "₹1200",
      image: "/src/assets/hero-beach.jpg",
      description:
        "An incredible solo journey through Southeast Asia on a budget. Discovered hidden gems, amazing street food, and met wonderful people along the way.",
      tags: ["Budget", "Solo", "Adventure", "Culture"],
      stats: { likes: 342, views: 1280 },
      rating: 4.8,
      publishDate: "2024-07-15", // now in date format
      isPublic: true,
    },
    {
      id: "2",
      title: "Family Adventure in Swiss Alps",
      author: { name: "The Johnson Family", avatar: "JF", verified: true },
      destination: "Interlaken, Zermatt, Lucerne",
      duration: "10 days",
      budget: "₹6800",
      image: "/src/assets/destination-mountains.jpg",
      description:
        "An unforgettable family trip to Switzerland with kids. Perfect mix of adventure and relaxation in the stunning Alps.",
      tags: ["Family", "Adventure", "Nature", "Mountains"],
      stats: { likes: 234, views: 890 },
      rating: 4.7,
      publishDate: "2024-06-25",
      isPublic: true,
    },
  ];

  useEffect(() => {
    const fetchPublicTrips = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/trips/public");
        // Only show public trips
        setTrips(res.data.filter((trip) => trip.isPublic));
      } catch (err) {
        console.error("Error fetching community trips:", err);
        // Fallback: only show public fallback trips
        setTrips(fallbackTrips.filter((trip) => trip.isPublic !== false));
      }
    };
    fetchPublicTrips();
  }, []);

  const mapTrip = (trip) => ({
    ...trip,
    author: trip.user
      ? {
        name: `${trip.user.firstName ?? ""} ${trip.user.lastName ?? ""}`.trim() || "Unknown",
        avatar: trip.user.avatarUrl
          ? trip.user.avatarUrl
          : (trip.user.firstName?.[0] ?? "") + (trip.user.lastName?.[0] ?? ""),
        verified: trip.user.isVerified ?? false,
      }
      : { name: "Unknown", avatar: "?", verified: false },
  });

  const getFilteredTrips = () => {
    let filtered = trips.length ? trips : fallbackTrips;
    filtered = filtered.map(mapTrip);

    if (searchQuery) {
      filtered = filtered.filter(
        (trip) =>
          trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.stats.likes - a.stats.likes;
        case "recent":
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case "rating":
          return b.rating - a.rating;
        case "budget":
          return (
            parseInt(a.budget.replace(/[^0-9]/g, "")) -
            parseInt(b.budget.replace(/[^0-9]/g, ""))
          );
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleLike = (id) => {
    console.log(`Liked trip: ${id}`);
  };

  const handleSave = (id) => {
    console.log(`Saved trip: ${id}`);
  };

  const handleViewTrip = (id) => {
    console.log(`View trip details: ${id}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Community Travel Experiences
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get inspired by real travel stories and detailed itineraries shared by fellow travelers
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search trips, destinations, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="budget">Budget (Low to High)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trips</SelectItem>
                    <SelectItem value="budget">Budget Travel</SelectItem>
                    <SelectItem value="luxury">Luxury Travel</SelectItem>
                    <SelectItem value="family">Family Friendly</SelectItem>
                    <SelectItem value="solo">Solo Travel</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredTrips().map((trip) => (
              <Card key={trip.id || trip._id} className="group overflow-hidden border-0 shadow-travel hover:shadow-travel-strong transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="relative overflow-hidden">
                  <img
                    src={trip.image || "/src/assets/hero-beach.jpg"}
                    alt={trip.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => handleViewTrip(trip.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Author info */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full pl-1 pr-3 py-1">
                    <Avatar className="w-6 h-6">
                      {trip.author?.avatar && trip.author?.avatar.startsWith("http") ? (
                        <img
                          src={trip.author.avatar}
                          alt={trip.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-accent text-white">
                          {trip.author?.avatar ?? "?"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-white text-sm font-medium">
                      {trip.author?.name ?? "Unknown"}
                    </span>
                    {trip.author?.verified && <span className="text-white text-xs">✓</span>}
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{trip.title}</h3>
                    <div className="flex items-center gap-1 text-sm opacity-90">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{trip.description}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium">{trip.rating}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">{trip.budget}</div>
                      <div className="text-xs text-muted-foreground">{trip.duration}</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {trip.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(trip.tags ?? []).slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(trip.tags ?? []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(trip.tags ?? []).length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{trip.stats?.likes ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{trip.stats?.views ?? 0}</span>
                      </div>
                    </div>
                    <span>
                      {trip.startDate && trip.endDate
                        ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`
                        : trip.startDate
                          ? new Date(trip.startDate).toLocaleDateString()
                          : trip.endDate
                            ? new Date(trip.endDate).toLocaleDateString()
                            : "No dates"}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleLike(trip.id)}>
                      <Heart className="w-3 h-3 mr-1" /> Like
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleSave(trip.id)}>
                      <BookOpen className="w-3 h-3 mr-1" /> Save
                    </Button>
                    <Button variant="hero" size="sm" className="flex-1" onClick={() => handleViewTrip(trip.id)}>
                      View Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {getFilteredTrips().length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No trips found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find more travel experiences
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Community;
