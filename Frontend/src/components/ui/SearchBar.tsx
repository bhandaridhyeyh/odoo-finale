import { useState } from "react";
import { Search, MapPin, Calendar, Users, Filter } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

interface SearchBarProps {
  onSearch?: (params: SearchParams) => void;
  className?: string;
}

interface SearchParams {
  destination: string;
  dates: string;
  travelers: number;
}

const SearchBar = ({ onSearch, className = "" }: SearchBarProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    destination: "",
    dates: "",
    travelers: 1,
  });

  const handleSearch = () => {
    onSearch?.(searchParams);
  };

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-travel-strong border border-white/20 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Where to?
          </label>
          <Input
            placeholder="Search destinations..."
            value={searchParams.destination}
            onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
            className="bg-white/50 border-primary/20 focus:border-primary"
          />
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            When?
          </label>
          <Input
            type="date"
            value={searchParams.dates}
            onChange={(e) => setSearchParams({ ...searchParams, dates: e.target.value })}
            className="bg-white/50 border-primary/20 focus:border-primary"
          />
        </div>

        {/* Travelers */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-1">
            <Users className="w-4 h-4" />
            Travelers
          </label>
          <select
            value={searchParams.travelers}
            onChange={(e) => setSearchParams({ ...searchParams, travelers: parseInt(e.target.value) })}
            className="flex h-10 w-full rounded-lg border border-primary/20 bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Traveler' : 'Travelers'}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex gap-2">
          <Button variant="hero" size="lg" onClick={handleSearch} className="flex-1">
            <Search className="w-4 h-4" />
            Search
          </Button>
          <Button variant="outline" size="lg" className="md:hidden">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;