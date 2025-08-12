import { Calendar, Users, MapPin, Clock } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  image: string;
  duration: string;
  travelers: number;
  cost: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  collaborators?: string[];
  onClick?: (id: string) => void;
}

const TripCard = ({
  id,
  title,
  destination,
  image,
  duration,
  travelers,
  cost,
  status,
  collaborators = [],
  onClick,
}: TripCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary text-primary-foreground';
      case 'ongoing': return 'bg-success text-success-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-travel hover:shadow-travel-strong transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="relative overflow-hidden" onClick={() => onClick?.(id)}>
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Trip info overlay */}
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <div className="flex items-center gap-1 text-sm opacity-90">
            <MapPin className="w-3 h-3" />
            <span>{destination}</span>
          </div>
        </div>
      </div>

      <div className="p-4" onClick={() => onClick?.(id)}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{travelers} travelers</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-bold text-primary">${cost.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total budget</div>
          </div>
          
          {collaborators.length > 0 && (
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((collaborator, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                >
                  {collaborator.charAt(0).toUpperCase()}
                </div>
              ))}
              {collaborators.length > 3 && (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium border-2 border-white">
                  +{collaborators.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button 
          variant={status === 'completed' ? 'outline' : 'default'} 
          size="sm" 
          className="w-full"
        >
          {status === 'completed' ? 'View Trip' : status === 'ongoing' ? 'Continue Planning' : 'View Itinerary'}
        </Button>
      </div>
    </Card>
  );
};

export default TripCard;