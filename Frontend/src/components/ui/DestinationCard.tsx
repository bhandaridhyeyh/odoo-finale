import { Heart, Star, MapPin } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface DestinationCardProps {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  description: string;
  isLiked?: boolean;
  onLike?: (id: string) => void;
  onClick?: (id: string) => void;
}

const DestinationCard = ({
  id,
  name,
  country,
  image,
  rating,
  reviewCount,
  price,
  description,
  isLiked = false,
  onLike,
  onClick,
}: DestinationCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-travel hover:shadow-travel-strong transition-all duration-300 hover:-translate-y-2 cursor-pointer">
      <div className="relative overflow-hidden" onClick={() => onClick?.(id)}>
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Like button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(id);
          }}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>

        {/* Rating badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Location badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-foreground">{country}</span>
        </div>
      </div>

      <div className="p-4" onClick={() => onClick?.(id)}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">${price}</div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <Button variant="outline" size="sm" className="w-full group-hover:variant-default transition-all">
          Explore Destination
        </Button>
      </div>
    </Card>
  );
};

export default DestinationCard;