import { Navbar } from '@/components/layout/Navbar';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Ticket, CreditCard, Calendar, MapPin, Mail, Phone, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    category: 'Booking',
    icon: Ticket,
    questions: [
      {
        question: 'How do I book tickets?',
        answer: 'Browse events or movies, select your preferred show time and seats, then proceed to checkout. Complete the payment to confirm your booking.'
      },
      {
        question: 'Can I book multiple tickets at once?',
        answer: 'Yes, you can select multiple seats during the booking process. The maximum number of seats per transaction is 10.'
      },
      {
        question: 'How do I view my booking details?',
        answer: 'Go to "My Bookings" from the profile menu to view all your past and upcoming bookings with complete details.'
      }
    ]
  },
  {
    category: 'Payments',
    icon: CreditCard,
    questions: [
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept Credit/Debit Cards, UPI, Net Banking, and popular digital wallets like Paytm, PhonePe, and Google Pay.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, all transactions are encrypted using industry-standard SSL technology. We do not store your card details on our servers.'
      },
      {
        question: 'What if my payment fails?',
        answer: 'If your payment fails, no amount is deducted. If deducted, it will be automatically refunded within 5-7 business days.'
      }
    ]
  },
  {
    category: 'Cancellation & Refunds',
    icon: Calendar,
    questions: [
      {
        question: 'Can I cancel my booking?',
        answer: 'Cancellation policies vary by event. Most movie tickets can be cancelled up to 2 hours before showtime. Check the specific event terms.'
      },
      {
        question: 'How long does a refund take?',
        answer: 'Refunds are processed within 5-7 business days after cancellation approval. The amount will be credited to your original payment method.'
      },
      {
        question: 'Are there any cancellation charges?',
        answer: 'Cancellation charges depend on the event type and timing. Generally, a convenience fee may apply for last-minute cancellations.'
      }
    ]
  },
  {
    category: 'Venue & Entry',
    icon: MapPin,
    questions: [
      {
        question: 'How do I find the venue location?',
        answer: 'Venue details including address and directions are available on the event page and in your booking confirmation.'
      },
      {
        question: 'What do I need to show at entry?',
        answer: 'Show your e-ticket (QR code) from the app or email confirmation along with a valid photo ID for entry.'
      },
      {
        question: 'Can I get a physical ticket?',
        answer: 'E-tickets are standard. Some venues may offer ticket printing at the venue counter if needed.'
      }
    ]
  }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">How can we help you?</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to frequently asked questions or contact our support team for assistance.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="grid gap-8 mb-12">
          {filteredFaqs.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <category.icon className="h-6 w-6 text-primary" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.category}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Still need help?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground text-sm mb-3">Get a response within 24 hours</p>
                <Button variant="outline" size="sm">support@tickethub.com</Button>
              </div>
              <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground text-sm mb-3">Available 9 AM - 9 PM IST</p>
                <Button variant="outline" size="sm">1800-123-4567</Button>
              </div>
              <div className="text-center p-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground text-sm mb-3">Chat with our support team</p>
                <Button size="sm">Start Chat</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}