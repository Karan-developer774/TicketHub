import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime, formatCurrency } from '@/lib/helpers';
import type { EventSchedule, SeatLayout } from '@/types';
import { 
  ArrowLeft, 
  Ticket,
  Loader2,
  Info,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SeatWithStatus extends SeatLayout {
  isBooked: boolean;
  isSelected: boolean;
}

export default function SeatSelectionPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { 
    selectedEvent, 
    selectedSchedule, 
    selectedSeats, 
    addSeat, 
    removeSeat, 
    clearSeats,
    setSelectedSchedule,
    setSelectedEvent,
    getTotalAmount 
  } = useBookingStore();

  const [schedule, setSchedule] = useState<EventSchedule | null>(selectedSchedule);
  const [seats, setSeats] = useState<SeatWithStatus[]>([]);
  const [bookedSeatIds, setBookedSeatIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: `/booking/${scheduleId}` } } });
      return;
    }

    fetchData();
    // NOTE: don't clear seats on unmount; user needs them on /checkout
    // Seats are cleared when:
    // - a new schedule is selected (store resets selectedSeats)
    // - booking completes (resetBooking)
  }, [scheduleId, user]);

  const fetchData = async () => {
    setIsLoading(true);

    // Fetch schedule if not in store
    if (!schedule || schedule.id !== scheduleId) {
      const { data: scheduleData } = await supabase
        .from('event_schedules')
        .select(`
          *,
          venue:venues(*),
          event:events(*, category:categories(*))
        `)
        .eq('id', scheduleId)
        .maybeSingle();
      
      if (scheduleData) {
        setSchedule(scheduleData as EventSchedule);
        setSelectedSchedule(scheduleData as EventSchedule);
        if (scheduleData.event) {
          setSelectedEvent(scheduleData.event as any);
        }
      }
    }

    // Get venue_id for seat layouts
    const venueId = schedule?.venue_id || (await supabase
      .from('event_schedules')
      .select('venue_id')
      .eq('id', scheduleId)
      .single()
    ).data?.venue_id;

    if (venueId) {
      // Fetch seat layouts
      const { data: seatData } = await supabase
        .from('seat_layouts')
        .select('*')
        .eq('venue_id', venueId)
        .eq('is_active', true)
        .order('section_name')
        .order('row_name')
        .order('seat_number');
      
      // Fetch booked seats for this schedule
      const { data: bookedData } = await supabase
        .from('booked_seats')
        .select('seat_id')
        .eq('schedule_id', scheduleId);
      
      const bookedIds = new Set(bookedData?.map(b => b.seat_id) || []);
      setBookedSeatIds(bookedIds);

      if (seatData) {
        const seatsWithStatus = seatData.map((seat: any) => ({
          ...seat,
          isBooked: bookedIds.has(seat.id),
          isSelected: selectedSeats.some(s => s.seat.id === seat.id)
        })) as SeatWithStatus[];
        setSeats(seatsWithStatus);
      }
    }

    setIsLoading(false);
  };

  const handleSeatClick = (seat: SeatWithStatus) => {
    if (seat.isBooked) {
      toast({ title: 'Seat unavailable', description: 'This seat is already booked.', variant: 'destructive' });
      return;
    }

    const price = (schedule?.price_min || 0) * (seat.price_multiplier || 1);
    
    if (selectedSeats.some(s => s.seat.id === seat.id)) {
      removeSeat(seat.id);
    } else {
      if (selectedSeats.length >= 10) {
        toast({ title: 'Maximum seats', description: 'You can select up to 10 seats.', variant: 'destructive' });
        return;
      }
      addSeat(seat, price);
    }

    setSeats(prev => prev.map(s => 
      s.id === seat.id ? { ...s, isSelected: !s.isSelected } : s
    ));
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast({ title: 'Select seats', description: 'Please select at least one seat.', variant: 'destructive' });
      return;
    }
    navigate('/checkout');
  };

  // Group seats by section and row
  const seatsBySection = seats.reduce((acc, seat) => {
    if (!acc[seat.section_name]) acc[seat.section_name] = {};
    if (!acc[seat.section_name][seat.row_name]) acc[seat.section_name][seat.row_name] = [];
    acc[seat.section_name][seat.row_name].push(seat);
    return acc;
  }, {} as Record<string, Record<string, SeatWithStatus[]>>);

  const event = selectedEvent || (schedule as any)?.event;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-foreground truncate">{event?.title}</h1>
            <p className="text-sm text-muted-foreground">
              {schedule && `${formatDate(schedule.start_time)} • ${formatTime(schedule.start_time)}`}
            </p>
          </div>
        </div>
      </header>

      {/* Seat Legend */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-secondary border border-border" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary" />
            <span className="text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-muted" />
            <span className="text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-warning" />
            <span className="text-muted-foreground">Premium</span>
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-2 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full mb-2" />
          <p className="text-center text-xs text-muted-foreground uppercase tracking-wider">Screen</p>
        </div>
      </div>

      {/* Seat Map */}
      <div className="container mx-auto px-4 overflow-x-auto">
        <div className="min-w-fit mx-auto max-w-3xl space-y-6">
          {Object.entries(seatsBySection).map(([section, rows]) => (
            <div key={section} className="space-y-2">
              <h3 className="text-sm font-semibold text-primary text-center mb-3">
                {section} - {formatCurrency((schedule?.price_min || 0) * (Object.values(rows)[0]?.[0]?.price_multiplier || 1))}
              </h3>
              {Object.entries(rows).map(([row, rowSeats]) => (
                <div key={row} className="flex items-center justify-center gap-1">
                  <span className="w-6 text-xs text-muted-foreground font-medium">{row}</span>
                  <div className="flex gap-1">
                    {rowSeats.map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.isBooked}
                        className={`w-7 h-7 rounded text-xs font-medium transition-all ${
                          seat.isBooked 
                            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                            : seat.isSelected
                              ? 'bg-primary text-primary-foreground scale-110'
                              : seat.seat_type === 'premium'
                                ? 'bg-warning/20 border border-warning hover:bg-warning/40'
                                : 'bg-secondary border border-border hover:border-primary hover:bg-primary/10'
                        }`}
                      >
                        {seat.seat_number}
                      </button>
                    ))}
                  </div>
                  <span className="w-6 text-xs text-muted-foreground font-medium">{row}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {seats.length === 0 && (
        <div className="container mx-auto px-4 py-12 text-center">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No seat layout available</h2>
          <p className="text-muted-foreground mb-6">
            Seat selection is not available for this venue.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      )}

      {/* Bottom Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border p-4">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                <span className="font-semibold">{selectedSeats.length} Seats</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedSeats.map(({ seat }) => (
                  <span 
                    key={seat.id} 
                    className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1"
                  >
                    {seat.row_name}{seat.seat_number}
                    <button onClick={() => {
                      removeSeat(seat.id);
                      setSeats(prev => prev.map(s => 
                        s.id === seat.id ? { ...s, isSelected: false } : s
                      ));
                    }}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(getTotalAmount())}</p>
              </div>
              <Button onClick={handleProceed} className="bg-gradient-primary hover:opacity-90">
                Proceed to Pay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
