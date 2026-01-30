import { Navbar } from '@/components/layout/Navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 2026
        </p>

        <div className="prose prose-invert max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the TicketHub platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
            </p>
            <p>
              TicketHub reserves the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on our platform. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p>
              TicketHub is an online ticket booking platform that enables users to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Browse and book tickets for movies, events, concerts, sports, and other entertainment</li>
              <li>Select seats and customize their booking experience</li>
              <li>Make secure online payments</li>
              <li>Receive electronic tickets and booking confirmations</li>
              <li>Access booking history and manage reservations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
            <p>
              <strong>3.1 Registration:</strong> To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration.
            </p>
            <p>
              <strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
            </p>
            <p>
              <strong>3.3 Account Termination:</strong> We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Booking and Payments</h2>
            <p>
              <strong>4.1 Booking Confirmation:</strong> A booking is confirmed only after successful payment. You will receive an electronic confirmation with booking details.
            </p>
            <p>
              <strong>4.2 Pricing:</strong> All prices displayed include applicable taxes unless otherwise stated. Prices are subject to change without prior notice until booking is confirmed.
            </p>
            <p>
              <strong>4.3 Convenience Fees:</strong> A convenience fee may be charged for online bookings. This fee is non-refundable except in cases of event cancellation by the organizer.
            </p>
            <p>
              <strong>4.4 Payment Methods:</strong> We accept various payment methods including credit/debit cards, UPI, net banking, and digital wallets. All payments are processed through secure payment gateways.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cancellations and Refunds</h2>
            <p>
              Cancellation and refund policies vary by event type and organizer. Please refer to our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a> for detailed information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. User Conduct</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Engage in ticket scalping or reselling at inflated prices</li>
              <li>Use automated systems or bots to make bookings</li>
              <li>Provide false information or impersonate others</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Intellectual Property</h2>
            <p>
              All content on the TicketHub platform, including logos, designs, text, graphics, and software, is the property of TicketHub or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Third-Party Content</h2>
            <p>
              The Service may contain links to third-party websites or content. We are not responsible for the content, accuracy, or practices of third-party sites. Your interactions with third parties are solely between you and the third party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, TicketHub shall not be liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Event cancellations or changes made by organizers</li>
              <li>Quality or content of events or performances</li>
              <li>Technical issues beyond our reasonable control</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of data or profits arising from use of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless TicketHub, its affiliates, officers, employees, and partners from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or your use of the Service shall be resolved through:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Good faith negotiation between the parties</li>
              <li>Mediation if negotiation fails</li>
              <li>Binding arbitration as per Indian Arbitration Act</li>
            </ul>
            <p className="mt-4">
              These Terms shall be governed by the laws of India, and the courts of Mumbai shall have exclusive jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li><strong>Email:</strong> legal@tickethub.com</li>
              <li><strong>Address:</strong> TicketHub India Pvt. Ltd., Level 15, Tower A, Peninsula Business Park, Lower Parel, Mumbai - 400013</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}