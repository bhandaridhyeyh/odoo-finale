import { useState } from "react";
import { Search as SearchIcon, Filter, MapPin, Star, Clock, DollarSign, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: "all",
    priceRange: "all",
    rating: "all",
    duration: "all",
  });

  const destinations = [
    {
      id: "1",
      name: "Santorini",
      country: "Greece",
      type: "destination",
      image: "/src/assets/hero-beach.jpg",
      rating: 4.8,
      reviewCount: 1284,
      price: "$150-300",
      duration: "3-7 days",
      description: "Famous for its stunning sunsets, white-washed buildings, and volcanic beaches. Perfect for romantic getaways and photography enthusiasts.",
      highlights: ["Sunset Views", "Wine Tasting", "Volcanic Beaches", "Traditional Architecture"],
    },
    {
      id: "2", 
      name: "Swiss Alps",
      country: "Switzerland",
      type: "destination",
      image: "/src/assets/destination-mountains.jpg",
      rating: 4.9,
      reviewCount: 956,
      price: "$200-400",
      duration: "5-10 days",
      description: "World-class skiing, hiking trails, and breathtaking mountain views. Adventure sports and pristine alpine lakes await.",
      highlights: ["Skiing", "Hiking", "Mountain Views", "Adventure Sports"],
    },
    {
      id: "3",
      name: "Tokyo",
      country: "Japan", 
      type: "destination",
      image: "/src/assets/destination-city.jpg",
      rating: 4.7,
      reviewCount: 2108,
      price: "$100-250",
      duration: "4-8 days",
      description: "Perfect blend of ancient traditions and cutting-edge technology. Incredible food scene, temples, and modern attractions.",
      highlights: ["Temples", "Food Scene", "Technology", "Culture"],
    },
  ];

  const activities = [
    {
      id: "4",
      name: "Sunset Photography Tour",
      location: "Santorini, Greece",
      type: "activity",
      image: "/src/assets/hero-beach.jpg",
      rating: 4.8,
      reviewCount: 324,
      price: "$80-120",
      duration: "3 hours",
      description: "Capture the perfect sunset at Oia with professional photography guidance and secret viewpoints.",
      highlights: ["Professional Guide", "Secret Spots", "Equipment Included", "Small Groups"],
    },
    {
      id: "5",
      name: "Alpine Hiking Experience",
      location: "Swiss Alps, Switzerland", 
      type: "activity",
      image: "/src/assets/destination-mountains.jpg",
      rating: 4.9,
      reviewCount: 187,
      price: "$60-150",
      duration: "6 hours",
      description: "Guided hiking tour through pristine alpine meadows with stunning mountain vistas and wildlife spotting.",
      highlights: ["Wildlife Spotting", "Mountain Views", "Alpine Meadows", "Expert Guide"],
    },
    {
      id: "6",
      name: "Traditional Tea Ceremony",
      location: "Tokyo, Japan",
      type: "activity", 
      image: "/src/assets/destination-city.jpg",
      rating: 4.6,
      reviewCount: 542,
      price: "$40-80",
      duration: "2 hours",
      description: "Authentic Japanese tea ceremony experience in a traditional setting with cultural insights.",
      highlights: ["Authentic Experience", "Cultural Learning", "Traditional Setting", "Tea Tasting"],
    },
  ];

  const cities = [
    {
      id: "7",
      name: "Paris",
      country: "France",
      type: "city",
      image: "/src/assets/destination-city.jpg",
      rating: 4.7,
      reviewCount: 3421,
      price: "$120-280",
      duration: "3-6 days",
      description: "The City of Light offers world-class museums, romantic atmosphere, and incredible cuisine.",
      highlights: ["Museums", "Romance", "Cuisine", "Architecture"],
    },
    {
      id: "8",
      name: "Bali",
      country: "Indonesia", 
      type: "city",
      image: "/src/assets/hero-beach.jpg",
      rating: 4.5,
      reviewCount: 2156,
      price: "$50-150",
      duration: "5-10 days",
      description: "Tropical paradise with stunning beaches, temples, and vibrant culture. Perfect for relaxation and adventure.",
      highlights: ["Beaches", "Temples", "Culture", "Wellness"],
    },
  ];

  const allResults = [...destinations, ...activities, ...cities];

  const getFilteredResults = (type?: string) => {
    let results = type ? allResults.filter(item => item.type === type) : allResults;
    
    if (searchQuery) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ('country' in item && item.country?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ('location' in item && item.location?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return results;
  };

  const handleLike = (id: string) => {
    console.log(`Liked item: ${id}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover Amazing Places & Activities
            </h1>
            <p className="text-xl text-muted-foreground">
              Find the perfect destinations and experiences for your next adventure
            </p>
          </div>

          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search destinations, cities, or activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select
                    value={selectedFilters.category}
                    onValueChange={(value) => setSelectedFilters({...selectedFilters, category: value})}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="destination">Destinations</SelectItem>
                      <SelectItem value="activity">Activities</SelectItem>
                      <SelectItem value="city">Cities</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedFilters.priceRange}
                    onValueChange={(value) => setSelectedFilters({...selectedFilters, priceRange: value})}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="budget">Budget ($0-100)</SelectItem>
                      <SelectItem value="moderate">Moderate ($100-250)</SelectItem>
                      <SelectItem value="luxury">Luxury ($250+)</SelectItem>
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

          {/* Results Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-lg">
              <TabsTrigger value="all">All ({allResults.length})</TabsTrigger>
              <TabsTrigger value="destination">Destinations</TabsTrigger>
              <TabsTrigger value="activity">Activities</TabsTrigger>
              <TabsTrigger value="city">Cities</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ResultsGrid results={getFilteredResults()} onLike={handleLike} />
            </TabsContent>

            <TabsContent value="destination">
              <ResultsGrid results={getFilteredResults("destination")} onLike={handleLike} />
            </TabsContent>

            <TabsContent value="activity">
              <ResultsGrid results={getFilteredResults("activity")} onLike={handleLike} />
            </TabsContent>

            <TabsContent value="city">
              <ResultsGrid results={getFilteredResults("city")} onLike={handleLike} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

const ResultsGrid = ({ results, onLike }: { results: any[], onLike: (id: string) => void }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
        <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((item) => (
        <Card key={item.id} className="group overflow-hidden border-0 shadow-travel hover:shadow-travel-strong transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="relative overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            <Button
              size="icon"
              variant="ghost" 
              className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onLike(item.id);
              }}
            >
              <Heart className="w-4 h-4" />
            </Button>

            <Badge className="absolute top-3 left-3 capitalize">
              {item.type}
            </Badge>

            <div className="absolute bottom-3 left-3 text-white">
              <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
              <div className="flex items-center gap-1 text-sm opacity-90">
                <MapPin className="w-3 h-3" />
                <span>{'country' in item ? item.country : item.location}</span>
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="font-medium">{item.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({item.reviewCount})</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">{item.price}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.duration}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {item.highlights.slice(0, 3).map((highlight: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {highlight}
                </Badge>
              ))}
              {item.highlights.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{item.highlights.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Search;