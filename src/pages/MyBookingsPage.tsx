import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime, formatCurrency } from '@/lib/helpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Booking, Event, EventSchedule } from '@/types';
import { 
  ArrowLeft, 
  Ticket,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Loader2,
  TicketX
} from 'lucide-react';

interface BookingWithDetails extends Booking {
  event: Event;
  schedule: EventSchedule;
}

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const { user, initialize } = useAuthStore();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: '/bookings' } } });
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setIsLoading(true);
    
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        event:events(*),
        schedule:event_schedules(*, venue:venues(*))
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setBookings(data as BookingWithDetails[]);
    }
    
    setIsLoading(false);
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.schedule.start_time) > now && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => new Date(b.schedule.start_time) <= now || b.status === 'cancelled');

  const BookingCard = ({ booking }: { booking: BookingWithDetails }) => {
    const isPast = new Date(booking.schedule.start_time) <= now;
    
    return (
      <Link
        to={`/bookings/${booking.id}`}
        className="block bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
      >
        <div className="flex gap-4">
          <img
            src={booking.event.image_url || '/placeholder.svg'}
            alt={booking.event.title}
            className={`w-20 h-28 rounded-lg object-cover ${isPast ? 'opacity-60' : ''}`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground line-clamp-1">{booking.event.title}</h3>
              <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${
                booking.status === 'confirmed' 
                  ? 'bg-success/10 text-success'
                  : booking.status === 'cancelled'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-warning/10 text-warning'
              }`}>
                {booking.status}
              </span>
            </div>
            
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(booking.schedule.start_time)}
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(booking.schedule.start_time)}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{booking.schedule.venue?.name}</span>
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm">
                <Ticket className="h-3.5 w-3.5 text-primary" />
                <span className="text-muted-foreground">#{booking.booking_number?.slice(-8)}</span>
              </div>
              <span className="font-semibold text-foreground">{formatCurrency(booking.final_amount)}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground self-center" />
        </div>
      </Link>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">My Bookings</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-20 w-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                  <Ticket className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No upcoming bookings</h2>
                <p className="text-muted-foreground mb-6">
                  Start exploring events and book your tickets!
                </p>
                <Button asChild className="bg-gradient-primary hover:opacity-90">
                  <Link to="/">Explore Events</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-20 w-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                  <TicketX className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No past bookings</h2>
                <p className="text-muted-foreground">
                  Your completed bookings will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
