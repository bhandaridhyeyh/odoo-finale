import { useState } from "react";
import { Search, Filter, Heart, BookOpen, Users, MapPin, Calendar, Star, Eye } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filterBy, setFilterBy] = useState("all");

  const communityTrips = [
    {
      id: "1",
      title: "Solo Backpacking Through Southeast Asia",
      author: {
        name: "Sarah Chen",
        avatar: "SC",
        verified: true,
      },
      destination: "Thailand, Vietnam, Cambodia",
      duration: "30 days",
      budget: "₹1200",
      image: "/src/assets/hero-beach.jpg",
      description: "An incredible solo journey through Southeast Asia on a budget. Discovered hidden gems, amazing street food, and met wonderful people along the way.",
      highlights: ["Budget Travel", "Solo Travel", "Street Food", "Cultural Immersion"],
      stats: {
        likes: 342,
        views: 1280,
        saves: 89,
      },
      rating: 4.8,
      tags: ["Budget", "Solo", "Adventure", "Culture"],
      publishDate: "2 weeks ago",
    },
    {
      id: "2", 
      title: "Romantic European Honeymoon",
      author: {
        name: "Mark & Emma Wilson",
        avatar: "MW",
        verified: false,
      },
      destination: "Paris, Venice, Santorini",
      duration: "14 days",
      budget: "₹4500",
      image: "/src/assets/destination-city.jpg",
      description: "Our perfect honeymoon itinerary covering the most romantic cities in Europe. Every moment was magical!",
      highlights: ["Romantic", "Luxury", "Photography", "Fine Dining"],
      stats: {
        likes: 567,
        views: 2340,
        saves: 156,
      },
      rating: 4.9,
      tags: ["Romance", "Luxury", "Couples", "Europe"],
      publishDate: "1 month ago",
    },
    {
      id: "3",
      title: "Family Adventure in Swiss Alps",
      author: {
        name: "The Johnson Family", 
        avatar: "JF",
        verified: true,
      },
      destination: "Interlaken, Zermatt, Lucerne",
      duration: "10 days", 
      budget: "₹6800",
      image: "/src/assets/destination-mountains.jpg",
      description: "An unforgettable family trip to Switzerland with kids. Perfect mix of adventure and relaxation in the stunning Alps.",
      highlights: ["Family Friendly", "Adventure", "Nature", "Scenic Views"],
      stats: {
        likes: 234,
        views: 890,
        saves: 67,
      },
      rating: 4.7,
      tags: ["Family", "Adventure", "Nature", "Mountains"],
      publishDate: "3 weeks ago",
    },
    {
      id: "4",
      title: "Digital Nomad Life in Bali",
      author: {
        name: "Alex Rivera",
        avatar: "AR", 
        verified: true,
      },
      destination: "Ubud, Canggu, Seminyak",
      duration: "90 days",
      budget: "₹2100", 
      image: "/src/assets/hero-beach.jpg",
      description: "3 months working remotely from Bali. Amazing coworking spaces, beautiful beaches, and incredible local culture.",
      highlights: ["Remote Work", "Long Stay", "Coworking", "Beach Life"],
      stats: {
        likes: 445,
        views: 1567,
        saves: 123,
      },
      rating: 4.6,
      tags: ["Digital Nomad", "Remote Work", "Long Stay", "Beach"],
      publishDate: "1 week ago",
    },
    {
      id: "5",
      title: "Culinary Tour of Japan",
      author: {
        name: "Chef Marie Dubois",
        avatar: "MD",
        verified: true,
      },
      destination: "Tokyo, Kyoto, Osaka",
      duration: "12 days",
      budget: "₹3200",
      image: "/src/assets/destination-city.jpg", 
      description: "A foodie's paradise! From street food to Michelin stars, this trip covered the best of Japanese cuisine.",
      highlights: ["Food Tourism", "Cultural Experience", "Markets", "Cooking Classes"],
      stats: {
        likes: 678,
        views: 2890,
        saves: 234,
      },
      rating: 4.9,
      tags: ["Food", "Culture", "Cooking", "Japan"],
      publishDate: "2 months ago",
    },
    {
      id: "6",
      title: "Budget Backpacking Europe",
      author: {
        name: "College Squad",
        avatar: "CS",
        verified: false,
      },
      destination: "Berlin, Prague, Budapest",
      duration: "21 days",
      budget: "₹800",
      image: "/src/assets/destination-city.jpg",
      description: "Ultimate budget guide for college students wanting to explore Eastern Europe. Hostels, cheap eats, and free activities!",
      highlights: ["Ultra Budget", "Student Travel", "Hostels", "Free Activities"],
      stats: {
        likes: 123,
        views: 567,
        saves: 45,
      },
      rating: 4.4,
      tags: ["Budget", "Student", "Backpacking", "Europe"],
      publishDate: "1 month ago",
    },
  ];

  const getFilteredTrips = () => {
    let filtered = communityTrips;
    
    if (searchQuery) {
      filtered = filtered.filter(trip =>
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Sort trips
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.stats.likes - a.stats.likes;
        case 'recent':
          return a.publishDate.localeCompare(b.publishDate);
        case 'rating':
          return b.rating - a.rating;
        case 'budget':
          return parseInt(a.budget.replace(/[^0-9]/g, '')) - parseInt(b.budget.replace(/[^0-9]/g, ''));
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const handleLike = (id: string) => {
    console.log(`Liked trip: ${id}`);
  };

  const handleSave = (id: string) => {
    console.log(`Saved trip: ${id}`);
  };

  const handleViewTrip = (id: string) => {
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
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
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
                      <SelectValue />
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
                      <SelectValue />
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
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredTrips().map((trip) => (
              <Card key={trip.id} className="group overflow-hidden border-0 shadow-travel hover:shadow-travel-strong transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="relative overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => handleViewTrip(trip.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Author info overlay */}
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full pl-1 pr-3 py-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-gradient-to-r from-primary to-accent text-white">
                          {trip.author.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white text-sm font-medium">{trip.author.name}</span>
                      {trip.author.verified && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>

                  {/* Trip title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{trip.title}</h3>
                    <div className="flex items-center gap-1 text-sm opacity-90">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{trip.destination}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="font-medium">{trip.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">{trip.budget}</div>
                      <div className="text-xs text-muted-foreground">{trip.duration}</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {trip.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {trip.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {trip.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{trip.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{trip.stats.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{trip.stats.views}</span>
                      </div>
                    </div>
                    <span>{trip.publishDate}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleLike(trip.id)}
                    >
                      <Heart className="w-3 h-3 mr-1" />
                      Like
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSave(trip.id)}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="hero"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewTrip(trip.id)}
                    >
                      View Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
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