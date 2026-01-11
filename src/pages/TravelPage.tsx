import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { 
  TravelSearchForm, 
  TravelResultCard, 
  TravelSeatSelection,
  TravelCheckout,
  type TravelMode,
  type TravelResult 
} from '@/components/travel';
import { 
  ArrowLeft, 
  Plane,
  Loader2,
  SlidersHorizontal,
  ArrowUpDown,
  Clock,
  Star,
  Banknote
} from 'lucide-react';
import { toast } from 'sonner';

type ViewState = 'search' | 'results' | 'seats' | 'checkout';

interface SearchParams {
  source: string;
  destination: string;
  date: Date;
  passengers: number;
  mode: TravelMode;
}

// Mock travel operators data
const travelOperators = {
  bus: [
    { name: 'VRL Travels', rating: 4.5, totalRatings: 12500 },
    { name: 'SRS Travels', rating: 4.3, totalRatings: 8900 },
    { name: 'Neeta Tours', rating: 4.6, totalRatings: 15200 },
    { name: 'Purple Travels', rating: 4.2, totalRatings: 6800 },
    { name: 'IntrCity SmartBus', rating: 4.7, totalRatings: 9500 },
    { name: 'Shivneri', rating: 4.4, totalRatings: 11000 },
  ],
  train: [
    { name: 'Rajdhani Express', rating: 4.8, totalRatings: 25000 },
    { name: 'Shatabdi Express', rating: 4.7, totalRatings: 22000 },
    { name: 'Duronto Express', rating: 4.6, totalRatings: 18000 },
    { name: 'Garib Rath', rating: 4.3, totalRatings: 15000 },
  ],
  flight: [
    { name: 'IndiGo', rating: 4.4, totalRatings: 45000 },
    { name: 'Air India', rating: 4.2, totalRatings: 35000 },
    { name: 'SpiceJet', rating: 4.1, totalRatings: 28000 },
    { name: 'Vistara', rating: 4.6, totalRatings: 22000 },
    { name: 'Go First', rating: 4.0, totalRatings: 18000 },
  ],
};

const busTypes = ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Volvo Multi-Axle', 'Mercedes Benz'];
const trainClasses = ['1A - First AC', '2A - Second AC', '3A - Third AC', 'SL - Sleeper', 'CC - Chair Car'];
const flightClasses = ['Economy', 'Premium Economy', 'Business'];

function generateMockResults(params: SearchParams): TravelResult[] {
  const operators = travelOperators[params.mode];
  const results: TravelResult[] = [];
  
  const basePrices = { bus: 800, train: 1200, flight: 3500 };
  const basePrice = basePrices[params.mode];
  
  const departureTimes = ['06:00', '08:30', '10:15', '12:00', '14:30', '16:45', '18:00', '20:30', '22:00', '23:30'];
  const durations = {
    bus: ['5h 30m', '6h 00m', '6h 45m', '7h 15m', '8h 00m'],
    train: ['3h 30m', '4h 00m', '4h 30m', '5h 00m', '5h 30m'],
    flight: ['1h 15m', '1h 30m', '1h 45m', '2h 00m', '2h 15m'],
  };

  operators.forEach((operator, index) => {
    const numResults = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < numResults; i++) {
      const departureTime = departureTimes[(index + i) % departureTimes.length];
      const duration = durations[params.mode][Math.floor(Math.random() * durations[params.mode].length)];
      
      // Calculate arrival time
      const [depHour, depMin] = departureTime.split(':').map(Number);
      const [durHour, durMin] = duration.replace('h ', ':').replace('m', '').split(':').map(Number);
      let arrHour = depHour + durHour;
      let arrMin = depMin + durMin;
      if (arrMin >= 60) {
        arrHour += 1;
        arrMin -= 60;
      }
      arrHour = arrHour % 24;
      const arrivalTime = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;

      const priceVariation = Math.floor(Math.random() * 500) - 200;
      const amenities = ['WiFi', 'Charging', 'AC', 'Entertainment'];
      if (params.mode === 'bus') amenities.push('Blanket', 'Water Bottle');
      if (params.mode === 'flight') amenities.push('Meals', 'Entertainment');

      let busType = '';
      if (params.mode === 'bus') busType = busTypes[Math.floor(Math.random() * busTypes.length)];
      if (params.mode === 'train') busType = trainClasses[Math.floor(Math.random() * trainClasses.length)];
      if (params.mode === 'flight') busType = flightClasses[Math.floor(Math.random() * flightClasses.length)];

      results.push({
        id: `${operator.name}-${i}-${Date.now()}`,
        operatorName: operator.name,
        rating: operator.rating,
        totalRatings: operator.totalRatings,
        departureTime,
        arrivalTime,
        duration,
        source: params.source,
        destination: params.destination,
        price: basePrice + priceVariation + (index * 100),
        seatsAvailable: Math.floor(Math.random() * 30) + 5,
        busType,
        amenities: amenities.slice(0, 4),
        mode: params.mode,
      });
    }
  });

  return results.sort((a, b) => a.price - b.price);
}

export default function TravelPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [view, setView] = useState<ViewState>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [results, setResults] = useState<TravelResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<TravelResult | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'duration' | 'rating'>('price');
  const [filterPrice, setFilterPrice] = useState<[number, number] | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setSearchParams(params);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResults = generateMockResults(params);
    setResults(mockResults);
    setView('results');
    setIsLoading(false);
  };

  const handleSelectResult = (result: TravelResult) => {
    if (!user) {
      toast.error('Please login to book');
      navigate('/auth');
      return;
    }
    setSelectedResult(result);
    setView('seats');
  };

  const handleProceedToCheckout = (seats: any[], amount: number) => {
    setSelectedSeats(seats);
    setTotalAmount(amount);
    setView('checkout');
  };

  const handleBack = () => {
    if (view === 'checkout') {
      setView('seats');
    } else if (view === 'seats') {
      setView('results');
    } else if (view === 'results') {
      setView('search');
      setResults([]);
    }
  };

  // Sorting logic
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'departure':
        return a.departureTime.localeCompare(b.departureTime);
      case 'duration':
        return a.duration.localeCompare(b.duration);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Filter logic
  const filteredResults = filterPrice
    ? sortedResults.filter(r => r.price >= filterPrice[0] && r.price <= filterPrice[1])
    : sortedResults;

  // Render seat selection
  if (view === 'seats' && selectedResult && searchParams) {
    return (
      <TravelSeatSelection
        result={selectedResult}
        travelDate={searchParams.date}
        onBack={handleBack}
        onProceed={handleProceedToCheckout}
      />
    );
  }

  // Render checkout
  if (view === 'checkout' && selectedResult && searchParams) {
    return (
      <TravelCheckout
        result={selectedResult}
        selectedSeats={selectedSeats}
        totalAmount={totalAmount}
        travelDate={searchParams.date}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button 
            onClick={() => view === 'search' ? navigate('/') : handleBack()} 
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-travel" />
            <h1 className="text-lg font-semibold text-foreground">
              {view === 'search' ? 'Book Travel' : `${searchParams?.source} → ${searchParams?.destination}`}
            </h1>
          </div>
        </div>
      </header>

      {/* Search View */}
      {view === 'search' && (
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Where would you like to go?
            </h1>
            <p className="text-muted-foreground">
              Book bus, train, and flight tickets at the best prices
            </p>
          </div>

          {/* Search Form */}
          <TravelSearchForm onSearch={handleSearch} isLoading={isLoading} />

          {/* Popular Destinations */}
          <div className="mt-12">
            <h2 className="text-xl font-display font-bold mb-4">Popular Destinations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', price: 'from ₹1,299' },
                { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400', price: 'from ₹899' },
                { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400', price: 'from ₹1,599' },
                { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400', price: 'from ₹2,199' },
              ].map(dest => (
                <div 
                  key={dest.name}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img 
                    src={dest.image} 
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold">{dest.name}</h3>
                    <p className="text-white/80 text-sm">{dest.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Book With Us */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎫', title: 'Instant Confirmation', desc: 'Get your tickets instantly on your email and phone' },
              { icon: '💰', title: 'Best Prices', desc: 'We offer the lowest prices and exclusive discounts' },
              { icon: '🛡️', title: 'Safe & Secure', desc: '100% secure payments and verified operators' },
            ].map(feature => (
              <div key={feature.title} className="bg-card rounded-xl border border-border p-6 text-center">
                <span className="text-4xl mb-3 block">{feature.icon}</span>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results View */}
      {view === 'results' && (
        <div className="container mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-travel mb-4" />
              <p className="text-muted-foreground">Searching for best options...</p>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-muted-foreground">
                    {filteredResults.length} options found
                  </p>
                </div>
                
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <div className="flex gap-1">
                    {[
                      { id: 'price', label: 'Price', icon: Banknote },
                      { id: 'departure', label: 'Departure', icon: Clock },
                      { id: 'rating', label: 'Rating', icon: Star },
                    ].map(option => (
                      <Button
                        key={option.id}
                        variant={sortBy === option.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy(option.id as typeof sortBy)}
                        className={sortBy === option.id ? 'bg-travel hover:bg-travel/90' : ''}
                      >
                        <option.icon className="h-4 w-4 mr-1" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-4">
                {filteredResults.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xl font-semibold mb-2">No results found</p>
                    <p className="text-muted-foreground mb-4">Try changing your search criteria</p>
                    <Button onClick={() => setView('search')} variant="outline">
                      Modify Search
                    </Button>
                  </div>
                ) : (
                  filteredResults.map(result => (
                    <TravelResultCard
                      key={result.id}
                      result={result}
                      onSelect={handleSelectResult}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
