import { Film, Music, Bus, Clapperboard, Video, Laugh, Trophy, Theater, GraduationCap, Train, Plane, LucideIcon } from 'lucide-react';

export const categoryIcons: Record<string, LucideIcon> = {
  'Film': Film,
  'Clapperboard': Clapperboard,
  'Video': Video,
  'Music': Music,
  'Laugh': Laugh,
  'Trophy': Trophy,
  'Drama': Theater,
  'GraduationCap': GraduationCap,
  'Bus': Bus,
  'Train': Train,
  'Plane': Plane,
};

export const getCategoryIcon = (iconName?: string): LucideIcon => {
  if (!iconName) return Film;
  return categoryIcons[iconName] || Film;
};

export const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const getTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(d);
};

export const generateQRCode = (bookingNumber: string): string => {
  // This returns a data URL for a simple QR placeholder
  // In production, use a proper QR library
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingNumber)}`;
};
