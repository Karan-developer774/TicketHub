import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ArrowRightLeft, 
  Calendar as CalendarIcon, 
  MapPin, 
  Users,
  Plane,
  Bus,
  Train
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type TravelMode = 'flight' | 'bus' | 'train';

interface TravelSearchFormProps {
  onSearch: (params: {
    source: string;
    destination: string;
    date: Date;
    passengers: number;
    mode: TravelMode;
  }) => void;
  isLoading?: boolean;
}

const popularCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa'
];

export function TravelSearchForm({ onSearch, isLoading }: TravelSearchFormProps) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState(1);
  const [travelMode, setTravelMode] = useState<TravelMode>('bus');
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!source || !destination || !date) return;
    onSearch({
      source,
      destination,
      date,
      passengers,
      mode: travelMode,
    });
  };

  const filteredSourceCities = popularCities.filter(
    city => city.toLowerCase().includes(source.toLowerCase()) && city !== destination
  );

  const filteredDestCities = popularCities.filter(
    city => city.toLowerCase().includes(destination.toLowerCase()) && city !== source
  );

  const travelModes = [
    { id: 'bus' as TravelMode, icon: Bus, label: 'Bus' },
    { id: 'train' as TravelMode, icon: Train, label: 'Train' },
    { id: 'flight' as TravelMode, icon: Plane, label: 'Flight' },
  ];

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
      {/* Travel Mode Selector */}
      <div className="flex justify-center gap-2 mb-6">
        {travelModes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTravelMode(id)}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
              travelMode === id
                ? 'bg-travel text-white shadow-md'
                : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* Source */}
        <div className="lg:col-span-3 relative">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-travel" />
            <Input
              placeholder="Enter city"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onFocus={() => setShowSourceSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
              className="pl-10 h-12 bg-secondary border-0 text-lg"
            />
          </div>
          {showSourceSuggestions && source && filteredSourceCities.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover rounded-lg border border-border shadow-lg max-h-48 overflow-auto">
              {filteredSourceCities.map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setSource(city);
                    setShowSourceSuggestions(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="lg:col-span-1 flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="rounded-full h-12 w-12 bg-secondary border-border hover:bg-travel hover:text-white hover:border-travel transition-all"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Destination */}
        <div className="lg:col-span-3 relative">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              placeholder="Enter city"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setShowDestSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
              className="pl-10 h-12 bg-secondary border-0 text-lg"
            />
          </div>
          {showDestSuggestions && destination && filteredDestCities.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover rounded-lg border border-border shadow-lg max-h-48 overflow-auto">
              {filteredDestCities.map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setDestination(city);
                    setShowDestSuggestions(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="lg:col-span-2">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full h-12 justify-start text-left font-normal bg-secondary border-0',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5 text-travel" />
                {date ? format(date, 'EEE, dd MMM') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Passengers */}
        <div className="lg:col-span-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Passengers</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full h-12 pl-10 pr-4 bg-secondary border-0 rounded-lg appearance-none cursor-pointer text-foreground"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-2">
          <Button
            onClick={handleSearch}
            disabled={!source || !destination || !date || isLoading}
            className="w-full h-12 bg-gradient-to-r from-travel to-primary text-white font-semibold text-lg"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">Popular routes:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { from: 'Mumbai', to: 'Pune' },
            { from: 'Delhi', to: 'Jaipur' },
            { from: 'Bangalore', to: 'Chennai' },
            { from: 'Mumbai', to: 'Goa' },
          ].map(route => (
            <button
              key={`${route.from}-${route.to}`}
              onClick={() => {
                setSource(route.from);
                setDestination(route.to);
              }}
              className="px-3 py-1.5 bg-secondary rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              {route.from} → {route.to}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
