import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MapPin, 
  Star, 
  Wifi, 
  Zap,
  UtensilsCrossed,
  Tv,
  Wind,
  Bus,
  Train,
  Plane
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TravelMode } from './TravelSearchForm';

export interface TravelResult {
  id: string;
  operatorName: string;
  operatorLogo?: string;
  rating: number;
  totalRatings: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  source: string;
  destination: string;
  price: number;
  seatsAvailable: number;
  busType?: string;
  amenities: string[];
  mode: TravelMode;
}

interface TravelResultCardProps {
  result: TravelResult;
  onSelect: (result: TravelResult) => void;
}

const amenityIcons: Record<string, React.ElementType> = {
  'WiFi': Wifi,
  'Charging': Zap,
  'Meals': UtensilsCrossed,
  'Entertainment': Tv,
  'AC': Wind,
};

const modeIcons: Record<TravelMode, React.ElementType> = {
  bus: Bus,
  train: Train,
  flight: Plane,
};

export function TravelResultCard({ result, onSelect }: TravelResultCardProps) {
  const ModeIcon = modeIcons[result.mode];

  return (
    <div className="bg-card rounded-xl border border-border p-4 hover:border-travel/50 transition-all hover:shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Operator Info */}
        <div className="lg:w-48 flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
            {result.operatorLogo ? (
              <img src={result.operatorLogo} alt={result.operatorName} className="h-8 w-8" />
            ) : (
              <ModeIcon className="h-6 w-6 text-travel" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{result.operatorName}</h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-foreground">{result.rating}</span>
              <span className="text-muted-foreground">({result.totalRatings})</span>
            </div>
          </div>
        </div>

        {/* Time & Route */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {/* Departure */}
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{result.departureTime}</p>
              <p className="text-sm text-muted-foreground">{result.source}</p>
            </div>

            {/* Duration Line */}
            <div className="flex-1 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-travel" />
              <div className="flex-1 border-t-2 border-dashed border-border relative">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {result.duration}
                </span>
              </div>
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{result.arrivalTime}</p>
              <p className="text-sm text-muted-foreground">{result.destination}</p>
            </div>
          </div>

          {/* Type & Amenities */}
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {result.busType && (
              <Badge variant="outline" className="bg-secondary border-0">
                {result.busType}
              </Badge>
            )}
            <div className="flex items-center gap-2">
              {result.amenities.slice(0, 4).map(amenity => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <div
                    key={amenity}
                    className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center"
                    title={amenity}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                );
              })}
              {result.amenities.length > 4 && (
                <span className="text-xs text-muted-foreground">+{result.amenities.length - 4}</span>
              )}
            </div>
          </div>
        </div>

        {/* Price & Book */}
        <div className="lg:w-44 flex lg:flex-col items-center lg:items-end gap-3">
          <div className="flex-1 lg:text-right">
            <p className="text-2xl font-bold text-foreground">₹{result.price}</p>
            <p className={cn(
              'text-sm',
              result.seatsAvailable < 10 ? 'text-destructive' : 'text-success'
            )}>
              {result.seatsAvailable} seats left
            </p>
          </div>
          <Button
            onClick={() => onSelect(result)}
            className="bg-travel hover:bg-travel/90 text-white"
          >
            Select Seat
          </Button>
        </div>
      </div>
    </div>
  );
}
