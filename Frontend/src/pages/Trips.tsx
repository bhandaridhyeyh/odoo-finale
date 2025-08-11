import { useState } from "react";
import { Search, Filter, Calendar, MapPin, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TripCard from "@/components/ui/TripCard";
import { Link } from "react-router-dom";

const Trips = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");

  const mockTrips = [
    {
      id: "1",
      title: "European Grand Tour",
      destination: "Paris, Rome, Barcelona",
      image: "/src/assets/hero-beach.jpg",
      duration: "14 days",
      travelers: 4,
      cost: 8500,
      status: 'upcoming' as const,
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
      status: 'ongoing' as const,
      collaborators: ["David Wilson"],
    },
    {
      id: "3",
      title: "Tokyo Culture Immersion",
      destination: "Tokyo, Kyoto, Osaka",
      image: "/src/assets/destination-city.jpg",
      duration: "10 days", 
      travelers: 3,
      cost: 4500,
      status: 'completed' as const,
      collaborators: ["Emma Davis", "Frank Miller"],
    },
    {
      id: "4",
      title: "Bali Tropical Escape",
      destination: "Ubud, Canggu, Seminyak",
      image: "/src/assets/hero-beach.jpg",
      duration: "8 days",
      travelers: 2,
      cost: 2100,
      status: 'completed' as const,
      collaborators: ["Grace Taylor"],
    },
    {
      id: "5",
      title: "New York City Explorer",
      destination: "Manhattan, Brooklyn",
      image: "/src/assets/destination-city.jpg",
      duration: "5 days",
      travelers: 1,
      cost: 1800,
      status: 'upcoming' as const,
      collaborators: [],
    },
  ];

  const getFilteredTrips = (status?: string) => {
    let filtered = mockTrips;
    
    if (status && status !== 'all') {
      filtered = filtered.filter(trip => trip.status === status);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(trip => 
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort trips
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.title.localeCompare(b.title); // Mock sort by title for now
        case 'cost':
          return b.cost - a.cost;
        case 'duration':
          return parseInt(b.duration) - parseInt(a.duration);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const upcomingTrips = getFilteredTrips('upcoming');
  const ongoingTrips = getFilteredTrips('ongoing');
  const completedTrips = getFilteredTrips('completed');
  const allTrips = getFilteredTrips();

  const handleTripClick = (id: string) => {
    console.log(`Navigate to trip ${id} itinerary`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                My Trips
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage and view all your travel adventures
              </p>
            </div>
            <Button variant="hero" size="lg" asChild>
              <Link to="/create-trip">
                <Plus className="w-4 h-4 mr-2" />
                New Trip
              </Link>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-white rounded-2xl shadow-travel">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search trips by name or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Trip Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">All Trips ({allTrips.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    {...trip}
                    onClick={handleTripClick}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Upcoming Trips ({upcomingTrips.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    {...trip}
                    onClick={handleTripClick}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ongoing" className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-warning" />
                <h2 className="text-xl font-semibold">Ongoing Trips ({ongoingTrips.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    {...trip}
                    onClick={handleTripClick}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-success" />
                <h2 className="text-xl font-semibold">Completed Trips ({completedTrips.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    {...trip}
                    onClick={handleTripClick}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Empty State */}
          {allTrips.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No trips found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try adjusting your search terms" : "Start planning your first adventure!"}
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/create-trip">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Trip
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Trips;