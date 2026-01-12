import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useBookingStore } from '@/store/bookingStore';
import { Navbar } from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/events/EventCard';
import type { Event, Category } from '@/types';
import { getCategoryIcon } from '@/lib/helpers';
import { 
  Search, 
  Filter,
  X,
  Loader2,
  Calendar
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useBookingStore();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || searchQuery);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setLocalQuery(query);
      setSearchQuery(query);
    }
    searchEvents();
  }, [searchParams, selectedCategory]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);
    
    if (data) setCategories(data as Category[]);
  };

  const searchEvents = async () => {
    setIsLoading(true);
    
    let query = supabase
      .from('events')
      .select(`
        *,
        category:categories(*),
        venue:venues(*)
      `)
      .eq('is_active', true);
    
    const searchTerm = searchParams.get('q') || searchQuery;
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }
    
    const { data } = await query.order('is_featured', { ascending: false }).limit(50);
    
    if (data) setEvents(data as Event[]);
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    navigate(`/search?q=${encodeURIComponent(localQuery)}`);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setLocalQuery('');
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Search Bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, movies..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => {
                        const Icon = getCategoryIcon(category.icon);
                        const isSelected = selectedCategory === category.id;
                        return (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              isSelected 
                                ? 'bg-primary/10 text-primary' 
                                : 'hover:bg-secondary'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{category.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {(selectedCategory || searchQuery) && (
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory || searchQuery) && (
        <div className="border-b border-border py-2">
          <div className="container mx-auto px-4">
            <ScrollArea className="w-full">
              <div className="flex items-center gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    "{searchQuery}"
                    <button onClick={() => { setSearchQuery(''); setLocalQuery(''); navigate('/search'); }}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-20 w-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {events.length} result{events.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
