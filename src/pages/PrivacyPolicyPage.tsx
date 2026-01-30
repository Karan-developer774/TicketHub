import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Lock, Users, Database, Bell } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 2026
        </p>

        {/* Privacy Highlights */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Data Protection</h3>
              <p className="text-xs text-muted-foreground">Your data is encrypted and secure</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Transparency</h3>
              <p className="text-xs text-muted-foreground">We're clear about data usage</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Your Control</h3>
              <p className="text-xs text-muted-foreground">Manage your privacy settings</p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-invert max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p>
              TicketHub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
            </p>
            <p>
              By using TicketHub, you consent to the data practices described in this policy. If you do not agree with the terms of this privacy policy, please do not access the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">2.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Information:</strong> Name, date of birth, gender</li>
              <li><strong>Contact Information:</strong> Email address, phone number, mailing address</li>
              <li><strong>Account Information:</strong> Username, password, account preferences</li>
              <li><strong>Payment Information:</strong> Credit/debit card details, UPI ID, bank account information (processed securely through payment gateways)</li>
              <li><strong>Booking Information:</strong> Event preferences, seat selections, booking history</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, search queries</li>
              <li><strong>Location Data:</strong> Approximate location based on IP address, precise location if you enable location services</li>
              <li><strong>Cookies and Tracking:</strong> Session data, preferences, analytics information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              3. How We Use Your Information
            </h2>
            <p>We use the collected information for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Delivery:</strong> Processing bookings, sending confirmations, providing customer support</li>
              <li><strong>Personalization:</strong> Customizing recommendations, remembering preferences</li>
              <li><strong>Communication:</strong> Sending booking updates, promotional offers (with your consent), important service announcements</li>
              <li><strong>Security:</strong> Fraud prevention, account protection, platform security</li>
              <li><strong>Improvement:</strong> Analyzing usage patterns, improving our services, developing new features</li>
              <li><strong>Legal Compliance:</strong> Meeting regulatory requirements, responding to legal requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Event Organizers:</strong> Necessary booking details for entry and event management</li>
              <li><strong>Payment Processors:</strong> Secure payment processing partners</li>
              <li><strong>Service Providers:</strong> Third parties who assist in our operations (hosting, analytics, customer support)</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect rights and safety</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
            </ul>
            <p className="mt-4">
              <strong>We do not sell your personal information to third parties for marketing purposes.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Encrypted storage of sensitive information</li>
              <li>Regular security audits and assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="mt-4">
              While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at privacy@tickethub.com or through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies Policy</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience. Types of cookies we use:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
            </ul>
            <p className="mt-4">
              You can manage cookie preferences through your browser settings or our cookie consent manager.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Data Retention</h2>
            <p>
              We retain your personal information for as long as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your account is active</li>
              <li>Necessary to provide our services</li>
              <li>Required by legal obligations</li>
              <li>Needed to resolve disputes or enforce agreements</li>
            </ul>
            <p className="mt-4">
              Booking records are retained for 7 years for legal and tax purposes. You can request account deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13. We do not knowingly collect information from children. If you believe a child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <Bell className="h-6 w-6 text-primary" />
              10. Updates to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes through:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email notification to registered users</li>
              <li>Prominent notice on our platform</li>
              <li>Updated "Last modified" date</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
            <p>
              For privacy-related questions or concerns:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li><strong>Data Protection Officer:</strong> dpo@tickethub.com</li>
              <li><strong>Privacy Team:</strong> privacy@tickethub.com</li>
              <li><strong>Address:</strong> TicketHub India Pvt. Ltd., Level 15, Tower A, Peninsula Business Park, Lower Parel, Mumbai - 400013</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}