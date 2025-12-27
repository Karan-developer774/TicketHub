import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  showStatus?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'w-8 h-8 text-xs',
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-xl',
};

const statusSizeClasses = {
  xs: 'w-2.5 h-2.5 border',
  sm: 'w-3 h-3 border-2',
  md: 'w-3.5 h-3.5 border-2',
  lg: 'w-4 h-4 border-2',
  xl: 'w-5 h-5 border-2',
};

export function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  isOnline,
  showStatus = false,
  className,
}: AvatarProps) {
  const initials = fallback
    ? fallback
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className={cn('relative inline-block flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            'rounded-full object-cover ring-2 ring-background',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-gradient-to-br from-primary to-primary-muted flex items-center justify-center font-semibold text-primary-foreground ring-2 ring-background',
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-background',
            statusSizeClasses[size],
            isOnline ? 'bg-online' : 'bg-offline'
          )}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: Array<{ src?: string; fallback?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 3,
  size = 'sm',
  className,
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          fallback={avatar.fallback}
          size={size}
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground ring-2 ring-background',
            sizeClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
