import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock, CreditCard, CheckCircle2, XCircle } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-4">Refund Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 2026
        </p>

        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                <h3 className="font-semibold">Full Refund</h3>
                <p className="text-sm text-muted-foreground">24+ hours before event</p>
              </CardContent>
            </Card>
            <Card className="bg-warning/5 border-warning/20">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
                <h3 className="font-semibold">Partial Refund</h3>
                <p className="text-sm text-muted-foreground">2-24 hours before event</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4 text-center">
                <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <h3 className="font-semibold">No Refund</h3>
                <p className="text-sm text-muted-foreground">Less than 2 hours</p>
              </CardContent>
            </Card>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. General Refund Policy</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <p>
                At TicketHub, we understand that plans can change. Our refund policy is designed to be fair to both our customers and event organizers. Please read the following guidelines carefully before making a booking.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Movie Tickets</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong>More than 2 hours before showtime:</strong> Full refund minus convenience fee</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <span><strong>20 minutes to 2 hours before:</strong> 50% refund</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span><strong>Less than 20 minutes:</strong> No refund available</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Events & Concerts</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong>More than 48 hours before event:</strong> Full refund minus convenience fee</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <span><strong>24 to 48 hours before:</strong> 75% refund</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <span><strong>12 to 24 hours before:</strong> 50% refund</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span><strong>Less than 12 hours:</strong> No refund available</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Some premium events may have stricter cancellation policies. Please check the event details before booking.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Sports Events</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong>More than 72 hours before match:</strong> Full refund minus convenience fee</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <span><strong>24 to 72 hours before:</strong> 50% refund</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span><strong>Less than 24 hours:</strong> No refund available</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Refund Processing</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CreditCard className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="text-muted-foreground">
                    <p className="mb-3">
                      <strong>Processing Time:</strong> Refunds are processed within 5-7 business days after approval.
                    </p>
                    <p className="mb-3">
                      <strong>Refund Method:</strong> Refunds will be credited to the original payment method used during booking.
                    </p>
                    <p>
                      <strong>Bank Processing:</strong> Your bank may take an additional 3-5 business days to reflect the refund in your account.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Event Cancellation by Organizer</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <p>
                If an event is cancelled by the organizer, you will receive a full refund including convenience fees. We will notify you via email and SMS about the cancellation and refund process.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Non-Refundable Items</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <ul className="list-disc pl-6 space-y-2">
                <li>Convenience fees on partial refunds</li>
                <li>Food & beverage add-ons (unless event is cancelled)</li>
                <li>Insurance or protection plans</li>
                <li>Bookings marked as "Non-Refundable" at the time of purchase</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. How to Request a Refund</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Go to "My Bookings" in your account</li>
                <li>Select the booking you want to cancel</li>
                <li>Click on "Cancel Booking" or "Request Refund"</li>
                <li>Confirm the cancellation</li>
                <li>You will receive an email confirmation with refund details</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Us</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground">
              <p>
                For any refund-related queries, please contact our customer support:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Email: refunds@tickethub.com</li>
                <li>Phone: 1800-123-4567 (Toll-free)</li>
                <li>Support Hours: 9 AM - 9 PM IST (Monday - Sunday)</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}