import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate, formatTime, formatCurrency } from '@/lib/helpers';
import { createBookingNotification, createPaymentNotification } from '@/lib/notifications';
import { PaymentModal } from '@/components/checkout/PaymentModal';
import type { Offer } from '@/types';
import { 
  ArrowLeft, 
  Ticket,
  Tag,
  CreditCard,
  Wallet,
  Smartphone,
  Building,
  Check,
  Loader2,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay with any UPI app' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'Paytm, PhonePe, Amazon Pay' },
  { id: 'netbanking', name: 'Net Banking', icon: Building, description: 'All major banks' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { toast } = useToast();
  const { 
    selectedEvent, 
    selectedSchedule, 
    selectedSeats, 
    appliedOffer,
    discountAmount,
    applyOffer,
    clearOffer,
    getTotalAmount,
    getFinalAmount,
    resetBooking
  } = useBookingStore();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [offerCode, setOfferCode] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidatingOffer, setIsValidatingOffer] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!user || !selectedSchedule || selectedSeats.length === 0) {
      navigate('/');
      return;
    }
    fetchOffers();
  }, [user, selectedSchedule, selectedSeats]);

  const fetchOffers = async () => {
    const { data } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .lte('valid_from', new Date().toISOString())
      .gte('valid_until', new Date().toISOString())
      .limit(5);
    
    if (data) {
      setOffers(data as Offer[]);
    }
  };

  const handleApplyOffer = async () => {
    if (!offerCode.trim()) return;
    
    setIsValidatingOffer(true);
    
    const { data: offer } = await supabase
      .from('offers')
      .select('*')
      .eq('code', offerCode.toUpperCase())
      .eq('is_active', true)
      .lte('valid_from', new Date().toISOString())
      .gte('valid_until', new Date().toISOString())
      .maybeSingle();
    
    if (!offer) {
      toast({ title: 'Invalid code', description: 'This offer code is invalid or expired.', variant: 'destructive' });
      setIsValidatingOffer(false);
      return;
    }

    const total = getTotalAmount();
    if (offer.min_purchase && total < offer.min_purchase) {
      toast({ 
        title: 'Minimum not met', 
        description: `Minimum purchase of ${formatCurrency(offer.min_purchase)} required.`, 
        variant: 'destructive' 
      });
      setIsValidatingOffer(false);
      return;
    }

    let discount = 0;
    if (offer.discount_type === 'percentage') {
      discount = (total * offer.discount_value) / 100;
      if (offer.max_discount && discount > offer.max_discount) {
        discount = offer.max_discount;
      }
    } else {
      discount = offer.discount_value;
    }

    applyOffer(offer.code, discount);
    toast({ title: 'Offer applied!', description: `You saved ${formatCurrency(discount)}!` });
    setIsValidatingOffer(false);
  };

  const handleRemoveOffer = () => {
    clearOffer();
    setOfferCode('');
  };

  const handleOpenPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedSchedule || !selectedEvent || !user) return;
    
    setShowPaymentModal(false);
    setIsProcessing(true);
    
    try {
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          user_id: user.id,
          event_id: selectedEvent.id,
          schedule_id: selectedSchedule.id,
          total_amount: getTotalAmount(),
          discount_amount: discountAmount,
          final_amount: getFinalAmount(),
          payment_method: selectedPayment,
          payment_status: 'paid',
          status: 'confirmed',
          booking_number: `TKT${Date.now()}`
        }])
        .select()
        .single();
      
      if (bookingError) throw bookingError;

      // Create booked seats
      const bookedSeatsData = selectedSeats.map(({ seat, price }) => ({
        booking_id: booking.id,
        schedule_id: selectedSchedule.id,
        seat_id: seat.id,
        section_name: seat.section_name,
        row_name: seat.row_name,
        seat_number: seat.seat_number,
        price
      }));

      const { error: seatsError } = await supabase
        .from('booked_seats')
        .insert(bookedSeatsData);
      
      if (seatsError) throw seatsError;

      // Update available seats count
      await supabase
        .from('event_schedules')
        .update({ 
          available_seats: (selectedSchedule.available_seats || selectedSchedule.total_seats || 0) - selectedSeats.length 
        })
        .eq('id', selectedSchedule.id);

      // Create notifications
      await createBookingNotification(
        user.id,
        booking.booking_number,
        selectedEvent.title,
        booking.id
      );
      
      await createPaymentNotification(
        user.id,
        getFinalAmount(),
        selectedEvent.title
      );

      toast({ title: 'Booking confirmed!', description: 'Your tickets have been booked successfully.' });
      
      resetBooking();
      navigate(`/bookings/${booking.id}`);
      
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({ title: 'Booking failed', description: error.message || 'Something went wrong. Please try again.', variant: 'destructive' });
    }
    
    setIsProcessing(false);
  };

  if (!selectedEvent || !selectedSchedule) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-foreground">Checkout</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Payment Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Offers Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Apply Offer
              </h2>

              {appliedOffer ? (
                <div className="flex items-center justify-between p-4 bg-success/10 border border-success/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-semibold text-success">{appliedOffer}</p>
                      <p className="text-sm text-muted-foreground">You saved {formatCurrency(discountAmount)}!</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveOffer}>
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Enter offer code"
                      value={offerCode}
                      onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                    <Button onClick={handleApplyOffer} disabled={isValidatingOffer}>
                      {isValidatingOffer ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>

                  {offers.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Available Offers</p>
                      {offers.map((offer) => (
                        <button
                          key={offer.id}
                          onClick={() => setOfferCode(offer.code)}
                          className="w-full flex items-center justify-between p-3 border border-dashed border-primary/50 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <div className="text-left">
                            <p className="font-semibold text-primary">{offer.code}</p>
                            <p className="text-sm text-muted-foreground">{offer.title}</p>
                          </div>
                          <span className="text-xs text-primary">TAP TO APPLY</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Method
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      selectedPayment === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      selectedPayment === method.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    }`}>
                      <method.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 ${
                      selectedPayment === method.id 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                    }`}>
                      {selectedPayment === method.id && (
                        <Check className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              {/* Event Details */}
              <div className="flex gap-4 pb-4 border-b border-border">
                <img
                  src={selectedEvent.image_url || '/placeholder.svg'}
                  alt={selectedEvent.title}
                  className="w-20 h-28 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-2">{selectedEvent.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(selectedSchedule.start_time)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(selectedSchedule.start_time)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSchedule.venue?.name}
                  </p>
                </div>
              </div>

              {/* Seats */}
              <div className="py-4 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Ticket className="h-4 w-4 text-primary" />
                  <span className="font-medium">{selectedSeats.length} Tickets</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedSeats.map(({ seat }) => (
                    <span key={seat.id} className="px-2 py-0.5 bg-secondary text-xs rounded">
                      {seat.section_name} - {seat.row_name}{seat.seat_number}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="py-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getTotalAmount())}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Convenience Fee</span>
                  <span className="text-success">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-foreground">{formatCurrency(getFinalAmount())}</span>
                </div>
              </div>

              <Button 
                onClick={handleOpenPayment} 
                disabled={isProcessing}
                className="w-full mt-6 bg-gradient-primary hover:opacity-90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Confirming Booking...
                  </>
                ) : (
                  `Pay ${formatCurrency(getFinalAmount())}`
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                <Info className="h-3 w-3" />
                Secure payment powered by TicketHub
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={getFinalAmount()}
        paymentMethod={selectedPayment}
      />
    </div>
  );
}
