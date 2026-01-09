import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import EventDetailPage from "./pages/EventDetailPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import CheckoutPage from "./pages/CheckoutPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/booking/:scheduleId" element={<SeatSelectionPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/bookings/:bookingId" element={<BookingConfirmationPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
