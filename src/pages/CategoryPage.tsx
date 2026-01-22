import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { EventCard } from '@/components/events/EventCard';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Search, Film, Music, Laugh, Trophy } from 'lucide-react';
import type { Event, Category } from '@/types';

// Category mapping for URL slugs
const categoryMapping: Record<string, { name: string; type: string; icon: any }> = {
  'bollywood': { name: 'Bollywood', type: 'movie', icon: Film },
  'hollywood': { name: 'Hollywood', type: 'movie', icon: Film },
  'regional': { name: 'Regional Cinema', type: 'movie', icon: Film },
  'concerts': { name: 'Live Concerts', type: 'event', icon: Music },
  'comedy': { name: 'Comedy Shows', type: 'event', icon: Laugh },
  'sports': { name: 'Sports Events', type: 'event', icon: Trophy },
};

export default function CategoryPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const categoryInfo = slug ? categoryMapping[slug] : null;

  useEffect(() => {
    fetchEvents();
  }, [slug, id]);

  const fetchEvents = async () => {
    setIsLoading(true);
    
    let categoryId = id;
    
    if (slug && categoryInfo) {
      // First try to get the category by name from mapping
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('name', categoryInfo.name)
        .maybeSingle();

      if (catData) {
        categoryId = catData.id;
        setCategoryData(catData as Category);
      }
    } else if (slug && !categoryInfo) {
      // Try to find category by slug as name (case-insensitive search)
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .ilike('name', slug.replace(/-/g, ' '))
        .maybeSingle();

      if (catData) {
        categoryId = catData.id;
        setCategoryData(catData as Category);
      }
    } else if (id) {
      // Get category by ID
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (catData) {
        setCategoryData(catData as Category);
        categoryId = catData.id;
      }
    }

    // Fetch events if we have a category
    if (categoryId) {
      const { data: eventsData } = await supabase
        .from('events')
        .select(`
          *,
          category:categories(*),
          venue:venues(*)
        `)
        .eq('is_active', true)
        .eq('category_id', categoryId);

      if (eventsData) {
        setEvents(eventsData as Event[]);
      }
    }
    
    setIsLoading(false);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredEvents = filteredEvents.filter(e => e.is_featured);
  const regularEvents = filteredEvents.filter(e => !e.is_featured);

  // Use categoryData from DB if available, otherwise fall back to categoryInfo
  const displayInfo = categoryData ? {
    name: categoryData.name,
    type: categoryData.type,
    icon: categoryMapping[slug || '']?.icon || Film
  } : categoryInfo;

  // Format slug for display if no category found
  const displayName = displayInfo?.name || categoryData?.name || 
    (slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Category');

  // Get icon based on category type or name
  const getIcon = () => {
    if (categoryData) {
      const iconMap: Record<string, any> = {
        'Film': Film,
        'Clapperboard': Film,
        'Video': Film,
        'Music': Music,
        'Laugh': Laugh,
        'Trophy': Trophy,
      };
      return iconMap[categoryData.icon || ''] || Film;
    }
    return displayInfo?.icon || Film;
  };

  const Icon = getIcon();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-b from-secondary/50 to-background py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                displayInfo?.type === 'movie' ? 'bg-movie/20 text-movie' : 'bg-event/20 text-event'
              }`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">{displayName}</h1>
                <p className="text-muted-foreground">
                  {filteredEvents.length} {displayInfo?.type === 'movie' ? 'movies' : 'events'} available
                </p>
              </div>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${displayName.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-poster rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
              <Icon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No {displayName} Found</h2>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'Check back later for new additions'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Section */}
            {featuredEvents.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-display font-bold mb-4">Featured</h2>
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
              </section>
            )}

            {/* All Events Grid */}
            <section>
              <h2 className="text-xl font-display font-bold mb-4">
                {featuredEvents.length > 0 ? `All ${displayName}` : displayName}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {regularEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
                {featuredEvents.length > 0 && regularEvents.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-8">
                    All {displayName.toLowerCase()} are featured above
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
