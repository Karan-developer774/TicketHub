import { create } from 'zustand';
import type { Event, EventSchedule, Booking, Category, SeatLayout } from '@/types';

interface SelectedSeat {
  seat: SeatLayout;
  price: number;
}

interface BookingState {
  // Search & Filters
  searchQuery: string;
  selectedCategory: string | null;
  selectedCity: string;
  selectedDate: Date | null;
  
  // Current selections
  selectedEvent: Event | null;
  selectedSchedule: EventSchedule | null;
  selectedSeats: SelectedSeat[];
  
  // Cart & Checkout
  appliedOffer: string | null;
  discountAmount: number;
  
  // UI State
  isBookingLoading: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedCity: (city: string) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedEvent: (event: Event | null) => void;
  setSelectedSchedule: (schedule: EventSchedule | null) => void;
  addSeat: (seat: SeatLayout, price: number) => void;
  removeSeat: (seatId: string) => void;
  clearSeats: () => void;
  applyOffer: (code: string, discountAmount: number) => void;
  clearOffer: () => void;
  getTotalAmount: () => number;
  getFinalAmount: () => number;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  searchQuery: '',
  selectedCategory: null,
  selectedCity: 'Mumbai',
  selectedDate: null,
  selectedEvent: null,
  selectedSchedule: null,
  selectedSeats: [],
  appliedOffer: null,
  discountAmount: 0,
  isBookingLoading: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setSelectedSchedule: (schedule) => set({ selectedSchedule: schedule, selectedSeats: [] }),
  
  addSeat: (seat, price) => set((state) => ({
    selectedSeats: [...state.selectedSeats, { seat, price }]
  })),
  
  removeSeat: (seatId) => set((state) => ({
    selectedSeats: state.selectedSeats.filter(s => s.seat.id !== seatId)
  })),
  
  clearSeats: () => set({ selectedSeats: [] }),
  
  applyOffer: (code, discountAmount) => set({ 
    appliedOffer: code, 
    discountAmount 
  }),
  
  clearOffer: () => set({ appliedOffer: null, discountAmount: 0 }),
  
  getTotalAmount: () => {
    const { selectedSeats } = get();
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  },
  
  getFinalAmount: () => {
    const { discountAmount } = get();
    const total = get().getTotalAmount();
    return Math.max(0, total - discountAmount);
  },
  
  resetBooking: () => set({
    selectedEvent: null,
    selectedSchedule: null,
    selectedSeats: [],
    appliedOffer: null,
    discountAmount: 0,
  }),
}));
