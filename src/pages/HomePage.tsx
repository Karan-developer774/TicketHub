import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { EventCard } from '@/components/events/EventCard';
import { CategoryBadge } from '@/components/ui/badge-variants';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { getCategoryIcon, cities, formatCurrency } from '@/lib/helpers';
import type { Event, Category } from '@/types';
import { 
  Search, 
  MapPin, 
  Ticket, 
  ChevronDown, 
  User, 
  Film, 
  Music, 
  Plane,
  Star,
  TrendingUp,
  Calendar,
  LogOut,
  Settings,
  History,
  Menu,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile, signOut, isLoading: authLoading, initialize } = useAuthStore();
  const { searchQuery, setSearchQuery, selectedCity, setSelectedCity, selectedCategory, setSelectedCategory } = useBookingStore();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);
    
    if (categoriesData) {
      setCategories(categoriesData as Category[]);
    }

    // Fetch events with category and venue
    const { data: eventsData } = await supabase
      .from('events')
      .select(`
        *,
        category:categories(*),
        venue:venues(*)
      `)
      .eq('is_active', true)
      .limit(20);
    
    if (eventsData) {
      setEvents(eventsData as Event[]);
    }
    
    setIsLoading(false);
  };

  const featuredEvents = events.filter(e => e.is_featured);
  const movieEvents = events.filter(e => e.category?.type === 'movie');
  const liveEvents = events.filter(e => e.category?.type === 'event');
  const travelEvents = events.filter(e => e.category?.type === 'travel');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Ticket className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold gradient-text hidden sm:block">
                TicketHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/movies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <Film className="h-4 w-4" />
                Movies
              </Link>
              <Link to="/events" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <Music className="h-4 w-4" />
                Events
              </Link>
              <Link to="/travel" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <Plane className="h-4 w-4" />
                Travel
              </Link>
            </nav>

            {/* City Selector & Actions */}
            <div className="flex items-center gap-3">
              {/* City Selector */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">{selectedCity}</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-1">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCity === city 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-secondary'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Actions */}
              {user ? (
                <>
                  <NotificationDropdown />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2">
                        <p className="font-medium text-foreground">{profile?.full_name || 'User'}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/bookings" className="flex items-center gap-2">
                          <History className="h-4 w-4" />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button asChild size="sm" className="bg-gradient-primary hover:opacity-90">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border animate-slide-in-down">
              <div className="flex flex-col gap-2">
                <Link 
                  to="/movies" 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Film className="h-5 w-5 text-movie" />
                  <span>Movies</span>
                </Link>
                <Link 
                  to="/events" 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Music className="h-5 w-5 text-event" />
                  <span>Events</span>
                </Link>
                <Link 
                  to="/travel" 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plane className="h-5 w-5 text-travel" />
                  <span>Travel</span>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-pattern py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
              Book Tickets for{' '}
              <span className="gradient-text">Everything</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Movies, concerts, sports, travel — all in one place
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search movies, events, or travel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-32 text-lg rounded-2xl bg-secondary border-border focus:border-primary"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-primary hover:opacity-90"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.slice(0, 6).map((category) => {
              const Icon = getCategoryIcon(category.icon);
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/30 transition-all"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                <h2 className="text-xl md:text-2xl font-display font-bold">Featured</h2>
              </div>
              <Link to="/featured" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {featuredEvents.map((event) => (
                  <div key={event.id} className="w-[320px] md:w-[400px] flex-shrink-0">
                    <EventCard event={event} variant="featured" />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>
      )}

      {/* Movies Section */}
      {movieEvents.length > 0 && (
        <section className="py-8 md:py-12 bg-background-secondary">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-movie" />
                <h2 className="text-xl md:text-2xl font-display font-bold">Movies</h2>
              </div>
              <Link to="/movies" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movieEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Events Section */}
      {liveEvents.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-event" />
                <h2 className="text-xl md:text-2xl font-display font-bold">Live Events</h2>
              </div>
              <Link to="/events" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {liveEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Travel Section */}
      {travelEvents.length > 0 && (
        <section className="py-8 md:py-12 bg-background-secondary">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-travel" />
                <h2 className="text-xl md:text-2xl font-display font-bold">Travel</h2>
              </div>
              <Link to="/travel" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {travelEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!isLoading && events.length === 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="h-24 w-24 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">No Events Yet</h2>
            <p className="text-muted-foreground mb-6">
              Events will appear here once they're added to the platform.
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Ticket className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold gradient-text">TicketHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your one-stop destination for booking tickets.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/movies" className="hover:text-foreground transition-colors">Movies</Link></li>
                <li><Link to="/events" className="hover:text-foreground transition-colors">Events</Link></li>
                <li><Link to="/travel" className="hover:text-foreground transition-colors">Travel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link to="/refunds" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TicketHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
