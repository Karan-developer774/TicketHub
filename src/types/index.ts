export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  type: 'movie' | 'event' | 'travel';
  is_active: boolean;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  capacity?: number;
  amenities?: string[];
  image_url?: string;
  location_lat?: number;
  location_lng?: number;
  is_active: boolean;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  venue_id?: string;
  image_url?: string;
  banner_url?: string;
  duration_minutes?: number;
  language?: string;
  rating?: string;
  age_restriction?: string;
  tags?: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  category?: Category;
  venue?: Venue;
}

export interface EventSchedule {
  id: string;
  event_id: string;
  venue_id: string;
  start_time: string;
  end_time?: string;
  price_min: number;
  price_max?: number;
  available_seats?: number;
  total_seats?: number;
  is_active: boolean;
  event?: Event;
  venue?: Venue;
}

export interface SeatLayout {
  id: string;
  venue_id: string;
  section_name: string;
  row_name: string;
  seat_number: number;
  seat_type: 'regular' | 'premium' | 'vip' | 'wheelchair';
  price_multiplier: number;
  is_active: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  schedule_id: string;
  booking_number: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  payment_id?: string;
  qr_code?: string;
  notes?: string;
  created_at: string;
  event?: Event;
  schedule?: EventSchedule;
  booked_seats?: BookedSeat[];
}

export interface BookedSeat {
  id: string;
  booking_id: string;
  schedule_id: string;
  seat_id?: string;
  section_name?: string;
  row_name?: string;
  seat_number?: number;
  price: number;
  seat?: SeatLayout;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_discount?: number;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'booking' | 'offer';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export type AppRole = 'admin' | 'user';
