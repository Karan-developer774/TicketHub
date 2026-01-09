import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime, formatCurrency, generateQRCode } from '@/lib/helpers';
import type { Booking, Event, EventSchedule } from '@/types';
import { 
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Download,
  Share2,
  Home,
  Check,
  Loader2
} from 'lucide-react';

interface BookingWithDetails extends Booking {
  event: Event;
  schedule: EventSchedule;
}

export default function BookingConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuthStore();
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [bookedSeats, setBookedSeats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookingId) fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    setIsLoading(true);
    
    const { data: bookingData } = await supabase
      .from('bookings')
      .select(`
        *,
        event:events(*),
        schedule:event_schedules(*, venue:venues(*))
      `)
      .eq('id', bookingId)
      .maybeSingle();
    
    if (bookingData) {
      setBooking(bookingData as BookingWithDetails);
      
      // Fetch booked seats
      const { data: seatsData } = await supabase
        .from('booked_seats')
        .select('*')
        .eq('booking_id', bookingId);
      
      if (seatsData) {
        setBookedSeats(seatsData);
      }
    }
    
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Header */}
      <div className="bg-gradient-primary py-12 text-center">
        <div className="h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
          <Check className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-primary-foreground/80">
          Your tickets have been booked successfully
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-6">
        <div className="max-w-2xl mx-auto">
          {/* Ticket Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
            {/* Top Section */}
            <div className="p-6 border-b border-dashed border-border relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-r-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-l-full" />
              
              <div className="flex gap-4">
                <img
                  src={booking.event.image_url || '/placeholder.svg'}
                  alt={booking.event.title}
                  className="w-24 h-32 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-display font-bold text-foreground mb-2">
                    {booking.event.title}
                  </h2>
                  <div className="space-y-1 text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(booking.schedule.start_time)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatTime(booking.schedule.start_time)}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {booking.schedule.venue?.name}, {booking.schedule.venue?.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section - Seats */}
            <div className="p-6 border-b border-dashed border-border relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-r-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-l-full" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Booking Number</p>
                  <p className="font-mono font-semibold text-foreground">{booking.booking_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tickets</p>
                  <p className="font-semibold text-foreground">{bookedSeats.length} Seats</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Seats</p>
                  <div className="flex flex-wrap gap-2">
                    {bookedSeats.map((seat) => (
                      <span key={seat.id} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-lg">
                        {seat.section_name} - {seat.row_name}{seat.seat_number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - QR Code */}
            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white p-4 rounded-xl">
                <img
                  src={generateQRCode(booking.booking_number)}
                  alt="QR Code"
                  className="w-32 h-32"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-muted-foreground mb-2">
                  Show this QR code at the venue entrance
                </p>
                <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(booking.final_amount)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmed' : booking.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Ticket
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <Button asChild className="w-full mt-4 bg-gradient-primary hover:opacity-90">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
