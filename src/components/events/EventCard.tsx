import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CategoryBadge, RatingBadge } from '@/components/ui/badge-variants';
import { formatCurrency } from '@/lib/helpers';
import type { Event } from '@/types';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function EventCard({ event, variant = 'default', className }: EventCardProps) {
  const categoryType = event.category?.type || 'event';

  if (variant === 'featured') {
    return (
      <Link
        to={`/event/${event.id}`}
        className={cn(
          'group relative block aspect-[21/9] overflow-hidden rounded-2xl',
          className
        )}
      >
        <img
          src={event.banner_url || event.image_url || '/placeholder.svg'}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-3 mb-3">
            <CategoryBadge type={categoryType} />
            {event.rating && <RatingBadge rating={event.rating} />}
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            {event.title}
          </h3>
          {event.venue && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.venue.name}, {event.venue.city}</span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/event/${event.id}`}
        className={cn(
          'group flex gap-3 rounded-lg p-2 transition-colors hover:bg-secondary',
          className
        )}
      >
        <img
          src={event.image_url || '/placeholder.svg'}
          alt={event.title}
          className="h-16 w-12 rounded-md object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {event.title}
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            {event.category?.name}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/event/${event.id}`}
      className={cn(
        'group block overflow-hidden rounded-xl ticket-card',
        className
      )}
    >
      <div className="aspect-poster relative overflow-hidden">
        <img
          src={event.image_url || '/placeholder.svg'}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {event.is_featured && (
          <div className="absolute top-2 right-2 rounded-full bg-gradient-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge type={categoryType} size="sm" />
          {event.rating && <RatingBadge rating={event.rating} />}
        </div>
        <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        {event.language && (
          <p className="text-sm text-muted-foreground mb-2">
            {event.language} {event.duration_minutes && `• ${event.duration_minutes} min`}
          </p>
        )}
        {event.venue && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{event.venue.city}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
