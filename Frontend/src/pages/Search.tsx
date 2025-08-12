import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Search as SearchIcon,
  Filter,
  MapPin,
  Star,
  Clock,
  Heart
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: "all",
    priceRange: "all",
    rating: "all",
    duration: "all"
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const query = params.get("query");

  const fetchResults = async (type?: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/search", {
        params: { query: searchQuery, type }
      });
      // debug: inspect data shape
      console.log("API results:", res.data);
      setResults(res.data.results || []);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResults = (type?: string) => {
    let filtered = results;
    if (type && type !== "all") {
      filtered = filtered.filter((item) => item.type === type);
    }
    return filtered;
  };

  const handleLike = (id: string) => {
    console.log(`Liked item: ${id}`);
    // add your like logic
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
                    onKeyDown={(e) => e.key === "Enter" && fetchResults(selectedFilters.category)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fetchResults(selectedFilters.category)}
                  >
                    <SearchIcon className="w-4 h-4 mr-2" />
                    Search
                  </Button>

                  <Select
                    value={selectedFilters.category}
                    onValueChange={(value) =>
                      setSelectedFilters({ ...selectedFilters, category: value })
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
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
                    onValueChange={(value) =>
                      setSelectedFilters({ ...selectedFilters, priceRange: value })
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="budget">Budget (₹0-100)</SelectItem>
                      <SelectItem value="moderate">Moderate (₹100-250)</SelectItem>
                      <SelectItem value="luxury">Luxury (₹250+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-lg">
              <TabsTrigger value="all">All ({results.length})</TabsTrigger>
              <TabsTrigger value="destination">Destinations</TabsTrigger>
              <TabsTrigger value="activity">Activities</TabsTrigger>
              <TabsTrigger value="city">Cities</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                <ResultsGrid results={getFilteredResults()} onLike={handleLike} />
              )}
            </TabsContent>

            <TabsContent value="destination">
              <ResultsGrid
                results={getFilteredResults("destination")}
                onLike={handleLike}
              />
            </TabsContent>

            <TabsContent value="activity">
              <ResultsGrid
                results={getFilteredResults("activity")}
                onLike={handleLike}
              />
            </TabsContent>

            <TabsContent value="city">
              <ResultsGrid
                results={getFilteredResults("city")}
                onLike={handleLike}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

const ResultsGrid = ({
  results,
  onLike
}: {
  results: any[];
  onLike: (id: string) => void;
}) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No results found
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((item) => (
        <Card
          key={item.id}
          className="relative group overflow-hidden border-0 shadow-travel hover:shadow-travel-strong transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
          {/* Clickable overlay - only if URL exists */}
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10"
              aria-label={`Visit ${item.name}`}
              onClick={(e) => {
                // Only prevent default if the like button was clicked
                const target = e.target as HTMLElement;
                if (target.closest('button[aria-label="Like"]')) {
                  e.preventDefault();
                }
              }}
            />
          ) : null}

          <div className="relative overflow-hidden">
            <img
              src={item.image || "/src/assets/hero-beach.jpg"}
              alt={item.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Like button */}
            <Button
              size="icon"
              variant="ghost"
              aria-label="Like"
              className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white z-20"
              onClick={(e) => {
                e.stopPropagation();
                onLike(item.id);
              }}
            >
              <Heart className="w-4 h-4" />
            </Button>

            <Badge className="absolute top-3 left-3 capitalize z-20">
              {item.type}
            </Badge>

            <div className="absolute bottom-3 left-3 text-white z-20">
              <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
              <div className="flex items-center gap-1 text-sm opacity-90">
                <MapPin className="w-3 h-3" />
                <span>{item.country || item.location}</span>
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="font-medium">{item.rating ?? "-"}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({item.reviewCount ?? 0})
                </span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">{item.price ?? "-"}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.duration ?? "-"}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {item.highlights?.slice(0, 3).map((highlight: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {highlight}
                </Badge>
              ))}
              {item.highlights?.length > 3 && (
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
