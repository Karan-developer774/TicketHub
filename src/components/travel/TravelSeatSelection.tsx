import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar,
  X,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TravelResult } from './TravelResultCard';
import { format } from 'date-fns';

interface Seat {
  id: string;
  number: string;
  type: 'regular' | 'premium' | 'sleeper';
  price: number;
  isBooked: boolean;
  isSelected: boolean;
  position: { row: number; col: number };
  deck?: 'lower' | 'upper';
}

interface TravelSeatSelectionProps {
  result: TravelResult;
  travelDate: Date;
  onBack: () => void;
  onProceed: (selectedSeats: Seat[], totalAmount: number) => void;
}

// Generate mock seats for bus
const generateBusSeats = (basePrice: number): Seat[] => {
  const seats: Seat[] = [];
  const rows = 10;
  const cols = ['A', 'B', '', 'C', 'D']; // '' is aisle
  
  for (let row = 1; row <= rows; row++) {
    cols.forEach((col, colIndex) => {
      if (col === '') return; // Skip aisle
      
      const isLastRow = row === rows;
      const isPremium = row <= 3;
      const seatId = `${row}${col}`;
      
      seats.push({
        id: seatId,
        number: seatId,
        type: isPremium ? 'premium' : 'regular',
        price: isPremium ? basePrice + 100 : basePrice,
        isBooked: Math.random() < 0.3,
        isSelected: false,
        position: { row, col: colIndex },
      });
    });
  }
  
  return seats;
};

export function TravelSeatSelection({ 
  result, 
  travelDate, 
  onBack, 
  onProceed 
}: TravelSeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>(() => generateBusSeats(result.price));
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;
    
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else if (selectedSeats.length < 6) {
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // Group seats by row
  const seatsByRow: Record<number, Seat[]> = {};
  seats.forEach(seat => {
    if (!seatsByRow[seat.position.row]) {
      seatsByRow[seat.position.row] = [];
    }
    seatsByRow[seat.position.row].push(seat);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Select Seats</h1>
            <p className="text-sm text-muted-foreground">
              {result.operatorName} • {result.source} → {result.destination}
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            {/* Journey Info */}
            <div className="bg-card rounded-xl border border-border p-4 mb-6">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-travel" />
                  <span>{format(travelDate, 'EEE, dd MMM yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{result.departureTime} - {result.arrivalTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{result.duration}</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-secondary border border-border" />
                <span className="text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-travel" />
                <span className="text-muted-foreground">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-muted opacity-50" />
                <span className="text-muted-foreground">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-secondary border-2 border-warning" />
                <span className="text-muted-foreground">Premium</span>
              </div>
            </div>

            {/* Bus Layout */}
            <div className="bg-card rounded-2xl border border-border p-6 overflow-x-auto">
              {/* Driver */}
              <div className="flex justify-end mb-6">
                <div className="w-16 h-10 rounded-lg bg-secondary flex items-center justify-center border border-border">
                  <span className="text-xs text-muted-foreground">Driver</span>
                </div>
              </div>

              {/* Seats */}
              <div className="flex flex-col gap-3 items-center">
                {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{row}</span>
                    <div className="flex gap-3">
                      {rowSeats.slice(0, 2).map(seat => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.isBooked}
                          className={cn(
                            'h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all',
                            seat.isBooked && 'bg-muted opacity-50 cursor-not-allowed',
                            !seat.isBooked && !selectedSeats.find(s => s.id === seat.id) && 
                              seat.type === 'premium' && 'bg-secondary border-2 border-warning hover:bg-warning/20',
                            !seat.isBooked && !selectedSeats.find(s => s.id === seat.id) && 
                              seat.type === 'regular' && 'bg-secondary border border-border hover:bg-travel/20 hover:border-travel',
                            selectedSeats.find(s => s.id === seat.id) && 'bg-travel text-white border-travel'
                          )}
                        >
                          {seat.isBooked ? (
                            <X className="h-4 w-4" />
                          ) : (
                            seat.number
                          )}
                        </button>
                      ))}
                      {/* Aisle */}
                      <div className="w-8" />
                      {rowSeats.slice(2).map(seat => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.isBooked}
                          className={cn(
                            'h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all',
                            seat.isBooked && 'bg-muted opacity-50 cursor-not-allowed',
                            !seat.isBooked && !selectedSeats.find(s => s.id === seat.id) && 
                              seat.type === 'premium' && 'bg-secondary border-2 border-warning hover:bg-warning/20',
                            !seat.isBooked && !selectedSeats.find(s => s.id === seat.id) && 
                              seat.type === 'regular' && 'bg-secondary border border-border hover:bg-travel/20 hover:border-travel',
                            selectedSeats.find(s => s.id === seat.id) && 'bg-travel text-white border-travel'
                          )}
                        >
                          {seat.isBooked ? (
                            <X className="h-4 w-4" />
                          ) : (
                            seat.number
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
              
              {/* Selected Seats */}
              {selectedSeats.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {selectedSeats.map(seat => (
                    <div 
                      key={seat.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Seat {seat.number}</span>
                        {seat.type === 'premium' && (
                          <span className="text-xs bg-warning/20 text-warning px-1.5 py-0.5 rounded">
                            Premium
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">₹{seat.price}</span>
                        <button
                          onClick={() => handleSeatClick(seat)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No seats selected</p>
                  <p className="text-sm mt-1">Select up to 6 seats</p>
                </div>
              )}

              {/* Total */}
              {selectedSeats.length > 0 && (
                <>
                  <div className="border-t border-border pt-4 mb-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount</span>
                      <span className="text-travel">₹{totalAmount}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => onProceed(selectedSeats, totalAmount)}
                    className="w-full bg-travel hover:bg-travel/90 text-white"
                    size="lg"
                  >
                    Proceed to Pay
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
