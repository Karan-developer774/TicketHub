import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EventCard } from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Event, Category } from '@/types';
import { 
  ArrowLeft, 
  Search, 
  Film,
  Loader2,
  Calendar
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function MoviesPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch movie categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .eq('type', 'movie')
      .eq('is_active', true);
    
    if (categoriesData) {
      setCategories(categoriesData as Category[]);
    }

    // Fetch movies
    let query = supabase
      .from('events')
      .select(`
        *,
        category:categories!inner(*),
        venue:venues(*)
      `)
      .eq('is_active', true)
      .eq('categories.type', 'movie');
    
    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }
    
    const { data: eventsData } = await query.order('is_featured', { ascending: false });
    
    if (eventsData) {
      setEvents(eventsData as Event[]);
    }
    
    setIsLoading(false);
  };

  const filteredEvents = searchQuery 
    ? events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : events;

  const featuredMovies = filteredEvents.filter(e => e.is_featured);
  const nowShowing = filteredEvents.filter(e => !e.is_featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-movie" />
            <h1 className="text-lg font-semibold text-foreground">Movies</h1>
          </div>
          <div className="flex-1 max-w-md ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-0"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <ScrollArea className="w-full">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    !selectedCategory 
                      ? 'bg-movie text-white' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  All Movies
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      selectedCategory === category.id 
                        ? 'bg-movie text-white' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-20 w-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No movies found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try a different search term' : 'Movies will appear here soon'}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')} variant="outline">
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Movies */}
            {featuredMovies.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-display font-bold mb-4">Featured</h2>
                <ScrollArea className="w-full">
                  <div className="flex gap-4 pb-4">
                    {featuredMovies.map((event) => (
                      <div key={event.id} className="w-[320px] md:w-[400px] flex-shrink-0">
                        <EventCard event={event} variant="featured" />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </section>
            )}

            {/* Now Showing */}
            <section>
              <h2 className="text-xl font-display font-bold mb-4">
                {featuredMovies.length > 0 ? 'Now Showing' : 'All Movies'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {(featuredMovies.length > 0 ? nowShowing : filteredEvents).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
