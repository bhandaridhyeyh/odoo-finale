import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight, Compass, Users, Calendar, Star } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import DestinationCard from "@/components/ui/DestinationCard";
import TripCard from "@/components/ui/TripCard";
import heroImage from "@/assets/hero-beach.jpg";
import mountainsImage from "@/assets/destination-mountains.jpg";
import cityImage from "@/assets/destination-city.jpg";

const Index = () => {
  const [likedDestinations, setLikedDestinations] = useState<string[]>([]);

  const featuredDestinations = [
    {
      id: "1",
      name: "Santorini",
      country: "Greece",
      image: heroImage,
      rating: 4.8,
      reviewCount: 1284,
      price: 899,
      description: "Experience stunning sunsets, white-washed buildings, and crystal-clear waters in this iconic Greek island paradise.",
    },
    {
      id: "2", 
      name: "Swiss Alps",
      country: "Switzerland",
      image: mountainsImage,
      rating: 4.9,
      reviewCount: 956,
      price: 1299,
      description: "Adventure awaits in pristine alpine landscapes with world-class skiing, hiking, and breathtaking mountain views.",
    },
    {
      id: "3",
      name: "Tokyo",
      country: "Japan", 
      image: cityImage,
      rating: 4.7,
      reviewCount: 2108,
      price: 1099,
      description: "Immerse yourself in the perfect blend of ancient traditions and cutting-edge technology in Japan's vibrant capital.",
    },
  ];

  const sampleTrips = [
    {
      id: "1",
      title: "European Adventure",
      destination: "Paris, Rome, Barcelona",
      image: heroImage,
      duration: "14 days",
      travelers: 4,
      cost: 8500,
      status: 'upcoming' as const,
      collaborators: ["Alice", "Bob", "Charlie"],
    },
    {
      id: "2",
      title: "Mountain Retreat",
      destination: "Swiss Alps",
      image: mountainsImage,
      duration: "7 days",
      travelers: 2,
      cost: 3200,
      status: 'completed' as const,
      collaborators: ["David"],
    },
  ];

  const handleLike = (id: string) => {
    setLikedDestinations(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const features = [
    {
      icon: Compass,
      title: "Smart Planning",
      description: "AI-powered recommendations for the perfect itinerary based on your preferences."
    },
    {
      icon: Users,
      title: "Collaborate",
      description: "Plan together with friends and family. Share ideas, vote on activities, and build memories."
    },
    {
      icon: Calendar,
      title: "Organize",
      description: "Keep all your trip details in one place. Documents, reservations, and schedules."
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Beautiful travel destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Plan Your Perfect
              <span className="block bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover amazing destinations, create detailed itineraries, and collaborate with travel companions to make unforgettable memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="hero" size="xl" asChild>
                <Link to="/register">
                  Start Planning
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                Explore Destinations
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="animate-slide-up max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>

        {/* Floating Action Button */}
        <Button
          variant="floating"
          size="icon-lg"
          className="fixed bottom-8 right-8 z-50 animate-float"
          asChild
        >
          <Link to="/create-trip">
            <Plus className="w-6 h-6" />
          </Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose GlobeTrotter?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to plan, organize, and enjoy amazing trips with the people you love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center group hover-lift p-8 rounded-2xl bg-white shadow-travel border border-primary/10"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Destinations
              </h2>
              <p className="text-xl text-muted-foreground">
                Discover the world's most amazing places
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/destinations">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                {...destination}
                isLiked={likedDestinations.includes(destination.id)}
                onLike={handleLike}
                onClick={(id) => console.log(`Navigate to destination ${id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sample Trips */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Inspiring Trip Ideas
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get inspired by these amazing trips planned by our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {sampleTrips.map((trip) => (
              <TripCard
                key={trip.id}
                {...trip}
                onClick={(id) => console.log(`Navigate to trip ${id}`)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="lg" asChild>
              <Link to="/community">
                Explore More Trips
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust GlobeTrotter to plan their perfect trips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" asChild>
              <Link to="/register">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
