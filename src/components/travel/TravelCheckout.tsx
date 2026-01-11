import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Landmark, 
  Smartphone,
  Tag,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TravelResult } from './TravelResultCard';
import { format } from 'date-fns';

interface Seat {
  id: string;
  number: string;
  type: 'regular' | 'premium' | 'sleeper';
  price: number;
}

interface TravelCheckoutProps {
  result: TravelResult;
  selectedSeats: Seat[];
  totalAmount: number;
  travelDate: Date;
  onBack: () => void;
}

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, description: 'GPay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark, description: 'All major banks' },
  { id: 'wallet', label: 'Wallets', icon: Wallet, description: 'Paytm, Amazon Pay' },
];

export function TravelCheckout({ 
  result, 
  selectedSeats, 
  totalAmount, 
  travelDate, 
  onBack 
}: TravelCheckoutProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [passengers, setPassengers] = useState<{ name: string; age: string; gender: string }[]>(
    selectedSeats.map(() => ({ name: '', age: '', gender: 'male' }))
  );
  const [offerCode, setOfferCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState<{ code: string; discount: number } | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');

  const handleApplyOffer = async () => {
    if (!offerCode) return;
    
    const { data: offer } = await supabase
      .from('offers')
      .select('*')
      .eq('code', offerCode.toUpperCase())
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .lte('valid_from', new Date().toISOString())
      .single();
    
    if (!offer) {
      toast.error('Invalid or expired offer code');
      return;
    }

    if (offer.min_purchase && totalAmount < offer.min_purchase) {
      toast.error(`Minimum purchase of ₹${offer.min_purchase} required`);
      return;
    }

    let discount = 0;
    if (offer.discount_type === 'percentage') {
      discount = (totalAmount * offer.discount_value) / 100;
      if (offer.max_discount) {
        discount = Math.min(discount, offer.max_discount);
      }
    } else {
      discount = offer.discount_value;
    }

    setAppliedOffer({ code: offer.code, discount });
    toast.success(`Offer applied! You save ₹${discount}`);
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/auth');
      return;
    }

    if (!contactEmail || !contactPhone) {
      toast.error('Please fill in contact details');
      return;
    }

    if (passengers.some(p => !p.name || !p.age)) {
      toast.error('Please fill in all passenger details');
      return;
    }

    setIsProcessing(true);

    try {
      // Since travel bookings need event+schedule, we'll create a mock booking for demo
      // In production, you'd have travel-specific tables
      const bookingNumber = `TRV${Date.now().toString(36).toUpperCase()}`;
      const finalAmount = totalAmount - (appliedOffer?.discount || 0);

      // For demo, we'll just show success
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Booking confirmed!');
      
      // Navigate to a success page (reuse booking confirmation)
      navigate('/', { 
        state: { 
          travelBookingSuccess: true,
          bookingNumber,
          result,
          selectedSeats,
          passengers,
          travelDate,
          finalAmount
        } 
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const finalAmount = totalAmount - (appliedOffer?.discount || 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Complete Booking</h1>
            <p className="text-sm text-muted-foreground">
              {result.source} → {result.destination}
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Journey Summary */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-travel" />
                  <span className="font-medium">{result.source}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{result.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(travelDate, 'EEE, dd MMM yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{result.departureTime}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {result.operatorName} • {result.busType}
              </p>
            </div>

            {/* Passenger Details */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-travel" />
                Passenger Details
              </h3>
              
              <div className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={index} className="p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium">
                        Passenger {index + 1} - Seat {selectedSeats[index]?.number}
                      </span>
                      {selectedSeats[index]?.type === 'premium' && (
                        <span className="text-xs bg-warning/20 text-warning px-1.5 py-0.5 rounded">
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Full Name *</Label>
                        <Input
                          placeholder="Enter name"
                          value={passenger.name}
                          onChange={(e) => {
                            const updated = [...passengers];
                            updated[index].name = e.target.value;
                            setPassengers(updated);
                          }}
                          className="mt-1 bg-background"
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Age *</Label>
                        <Input
                          type="number"
                          placeholder="Age"
                          value={passenger.age}
                          onChange={(e) => {
                            const updated = [...passengers];
                            updated[index].age = e.target.value;
                            setPassengers(updated);
                          }}
                          className="mt-1 bg-background"
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Gender</Label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => {
                            const updated = [...passengers];
                            updated[index].gender = e.target.value;
                            setPassengers(updated);
                          }}
                          className="mt-1 w-full h-10 px-3 bg-background border border-border rounded-md"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">Contact Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your ticket will be sent to this email and phone
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email *</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone *</Label>
                  <Input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Offers */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Apply Offer
              </h3>
              
              {appliedOffer ? (
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium text-success">{appliedOffer.code}</span>
                    <span className="text-muted-foreground">- You save ₹{appliedOffer.discount}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setAppliedOffer(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter offer code"
                    value={offerCode}
                    onChange={(e) => setOfferCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleApplyOffer} variant="outline">
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-travel" />
                Payment Method
              </h3>
              
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paymentMethods.map(method => (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all',
                        selectedPayment === method.id
                          ? 'border-travel bg-travel/10'
                          : 'border-border bg-secondary hover:border-travel/50'
                      )}
                    >
                      <RadioGroupItem value={method.id} className="sr-only" />
                      <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center">
                        <method.icon className={cn(
                          'h-5 w-5',
                          selectedPayment === method.id ? 'text-travel' : 'text-muted-foreground'
                        )} />
                      </div>
                      <div>
                        <p className="font-medium">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">Fare Details</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare ({selectedSeats.length} seats)</span>
                  <span>₹{totalAmount}</span>
                </div>
                {appliedOffer && (
                  <div className="flex justify-between text-success">
                    <span>Discount ({appliedOffer.code})</span>
                    <span>-₹{appliedOffer.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span>₹0</span>
                </div>
              </div>

              <div className="border-t border-border my-4 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-travel">₹{finalAmount}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-travel to-primary text-white"
                size="lg"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${finalAmount}`}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                By clicking Pay, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
