import { cn } from '@/lib/utils';
import { Film, Music, Plane, Ticket, Star } from 'lucide-react';

interface CategoryBadgeProps {
  type: 'movie' | 'event' | 'travel';
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const typeConfig = {
  movie: {
    icon: Film,
    label: 'Movie',
    className: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  },
  event: {
    icon: Music,
    label: 'Event',
    className: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  travel: {
    icon: Plane,
    label: 'Travel',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function CategoryBadge({ type, className, showIcon = true, size = 'sm' }: CategoryBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </span>
  );
}

interface RatingBadgeProps {
  rating: string;
  className?: string;
}

export function RatingBadge({ rating, className }: RatingBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-warning/20 px-2 py-0.5 text-xs font-semibold text-warning',
        className
      )}
    >
      <Star className="h-3 w-3 fill-current" />
      {rating}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  className?: string;
}

const statusConfig = {
  pending: {
    className: 'bg-warning/10 text-warning border-warning/30',
    label: 'Pending',
  },
  confirmed: {
    className: 'bg-success/10 text-success border-success/30',
    label: 'Confirmed',
  },
  cancelled: {
    className: 'bg-destructive/10 text-destructive border-destructive/30',
    label: 'Cancelled',
  },
  completed: {
    className: 'bg-info/10 text-info border-info/30',
    label: 'Completed',
  },
  refunded: {
    className: 'bg-muted text-muted-foreground border-border',
    label: 'Refunded',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
