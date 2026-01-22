import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/helpers';
import { 
  CreditCard, 
  Lock, 
  Check, 
  Loader2,
  ShieldCheck,
  Smartphone,
  Building,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  paymentMethod: string;
}

type PaymentStep = 'input' | 'processing' | 'success';

export function PaymentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  amount, 
  paymentMethod 
}: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>('input');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processingText, setProcessingText] = useState('Initiating payment...');

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setUpiId('');
    }
  }, [isOpen]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePay = () => {
    setStep('processing');
    
    const processingSteps = [
      'Initiating payment...',
      'Connecting to payment gateway...',
      'Verifying payment details...',
      'Processing transaction...',
      'Confirming with bank...',
      'Finalizing payment...'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < processingSteps.length) {
        setProcessingText(processingSteps[stepIndex]);
      }
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      setStep('success');
    }, 3500);
  };

  const handleSuccessComplete = () => {
    onSuccess();
  };

  const isFormValid = () => {
    if (paymentMethod === 'upi') {
      return upiId.includes('@');
    }
    if (paymentMethod === 'card') {
      return cardNumber.replace(/\s/g, '').length === 16 && 
             expiry.length === 5 && 
             cvv.length === 3;
    }
    return true; // wallet and netbanking
  };

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case 'upi': return <Smartphone className="h-6 w-6" />;
      case 'card': return <CreditCard className="h-6 w-6" />;
      case 'wallet': return <Wallet className="h-6 w-6" />;
      case 'netbanking': return <Building className="h-6 w-6" />;
      default: return <CreditCard className="h-6 w-6" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getPaymentIcon()}
              <div>
                <p className="text-sm opacity-90">Amount to pay</p>
                <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
              </div>
            </div>
            <Lock className="h-5 w-5 opacity-70" />
          </div>
        </div>

        <div className="p-6">
          {/* Input Step */}
          {step === 'input' && (
            <div className="space-y-4">
              {paymentMethod === 'card' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="pl-10"
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your UPI ID linked with any UPI app
                  </p>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Select your wallet</p>
                  {['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'].map((wallet) => (
                    <button
                      key={wallet}
                      onClick={handlePay}
                      className="w-full flex items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary transition-colors"
                    >
                      <span className="font-medium">{wallet}</span>
                      <span className="text-xs text-primary">PAY NOW →</span>
                    </button>
                  ))}
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Select your bank</p>
                  {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak'].map((bank) => (
                    <button
                      key={bank}
                      onClick={handlePay}
                      className="w-full flex items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary transition-colors"
                    >
                      <span className="font-medium">{bank}</span>
                      <span className="text-xs text-primary">SELECT →</span>
                    </button>
                  ))}
                </div>
              )}

              {(paymentMethod === 'card' || paymentMethod === 'upi') && (
                <Button 
                  onClick={handlePay} 
                  disabled={!isFormValid()}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 mt-4"
                >
                  Pay {formatCurrency(amount)}
                </Button>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-lg">Processing Payment</p>
                <p className="text-sm text-muted-foreground animate-pulse">
                  {processingText}
                </p>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ 
                    width: '100%',
                    animation: 'progress 3.5s ease-in-out'
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Please do not close this window
              </p>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-6">
              <div className={cn(
                "h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center",
                "animate-in zoom-in duration-300"
              )}>
                <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-10 w-10 text-white" strokeWidth={3} />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="font-bold text-2xl text-green-500">Payment Successful!</p>
                <p className="text-muted-foreground">
                  {formatCurrency(amount)} paid successfully
                </p>
              </div>
              <div className="w-full p-4 bg-secondary/50 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">Transaction ID</p>
                <p className="font-mono font-semibold">TXN{Date.now()}</p>
              </div>
              <Button 
                onClick={handleSuccessComplete}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                View Booking Details
              </Button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
