import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { CategoryBadge, RatingBadge } from '@/components/ui/badge-variants';
import { formatDate, formatTime, formatCurrency } from '@/lib/helpers';
import type { Event, EventSchedule } from '@/types';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Star,
  Share2,
  Heart,
  Ticket,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setSelectedEvent, setSelectedSchedule } = useBookingStore();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [schedules, setSchedules] = useState<EventSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setIsLoading(true);
    
    const { data: eventData, error } = await supabase
      .from('events')
      .select(`
        *,
        category:categories(*),
        venue:venues(*)
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (eventData) {
      setEvent(eventData as Event);
      
      // Fetch schedules
      const { data: schedulesData } = await supabase
        .from('event_schedules')
        .select(`
          *,
          venue:venues(*)
        `)
        .eq('event_id', id)
        .eq('is_active', true)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });
      
      if (schedulesData) {
        setSchedules(schedulesData as EventSchedule[]);
        // Set first date as selected
        if (schedulesData.length > 0) {
          const firstDate = new Date(schedulesData[0].start_time).toDateString();
          setSelectedDate(firstDate);
        }
      }
    }
    
    setIsLoading(false);
  };

  const handleSelectSchedule = (schedule: EventSchedule) => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    setSelectedEvent(event);
    setSelectedSchedule(schedule);
    navigate(`/booking/${schedule.id}`);
  };

  // Group schedules by date
  const schedulesByDate = schedules.reduce((acc, schedule) => {
    const date = new Date(schedule.start_time).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, EventSchedule[]>);

  const uniqueDates = Object.keys(schedulesByDate);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="relative aspect-video md:aspect-[21/9] max-h-[400px] overflow-hidden">
        <img
          src={event.banner_url || event.image_url || '/placeholder.svg'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <CategoryBadge type={event.category?.type || 'event'} />
                {event.rating && <RatingBadge rating={event.rating} />}
                {event.age_restriction && (
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded">
                    {event.age_restriction}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                {event.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-foreground font-medium">{event.language}</span>
                  </span>
                )}
                {event.duration_minutes && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {Math.floor(event.duration_minutes / 60)}h {event.duration_minutes % 60}m
                  </span>
                )}
                {event.venue && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {event.venue.name}, {event.venue.city}
                  </span>
                )}
              </div>

              {event.description && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              )}

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Book Tickets
              </h2>

              {schedules.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No shows available</p>
                </div>
              ) : (
                <>
                  {/* Date Selector */}
                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground mb-2 block">Select Date</label>
                    <ScrollArea className="w-full">
                      <div className="flex gap-2 pb-2">
                        {uniqueDates.map((dateStr) => {
                          const date = new Date(dateStr);
                          const isSelected = selectedDate === dateStr;
                          return (
                            <button
                              key={dateStr}
                              onClick={() => setSelectedDate(dateStr)}
                              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border transition-all ${
                                isSelected 
                                  ? 'border-primary bg-primary/10 text-primary' 
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <span className="text-xs font-medium uppercase">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </span>
                              <span className="text-lg font-bold">{date.getDate()}</span>
                              <span className="text-xs">
                                {date.toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && schedulesByDate[selectedDate] && (
                    <div className="space-y-3">
                      <label className="text-sm text-muted-foreground">Select Showtime</label>
                      {schedulesByDate[selectedDate].map((schedule) => (
                        <button
                          key={schedule.id}
                          onClick={() => handleSelectSchedule(schedule)}
                          className="w-full flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                          <div className="text-left">
                            <p className="font-semibold text-foreground">
                              {formatTime(schedule.start_time)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {schedule.venue?.name || 'Venue'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">from</p>
                            <p className="font-semibold text-primary">
                              {formatCurrency(schedule.price_min)}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
