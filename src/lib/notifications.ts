import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 'booking' | 'reminder' | 'payment' | 'info';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}

export async function createNotification({
  userId,
  title,
  message,
  type = 'info',
  link
}: CreateNotificationParams): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      type,
      link,
      is_read: false
    });

  if (error) {
    console.error('Error creating notification:', error);
    return false;
  }

  return true;
}

export async function createBookingNotification(
  userId: string,
  bookingNumber: string,
  eventTitle: string,
  bookingId: string
): Promise<boolean> {
  return createNotification({
    userId,
    title: 'Booking Confirmed! 🎉',
    message: `Your booking for "${eventTitle}" is confirmed. Booking #${bookingNumber}`,
    type: 'booking',
    link: `/booking/${bookingId}`
  });
}

export async function createPaymentNotification(
  userId: string,
  amount: number,
  eventTitle: string
): Promise<boolean> {
  return createNotification({
    userId,
    title: 'Payment Successful ✓',
    message: `Payment of ₹${amount.toLocaleString()} for "${eventTitle}" was successful.`,
    type: 'payment'
  });
}

export async function createReminderNotification(
  userId: string,
  eventTitle: string,
  eventDate: string,
  bookingId: string
): Promise<boolean> {
  return createNotification({
    userId,
    title: 'Event Reminder 📅',
    message: `Don't forget! "${eventTitle}" is coming up on ${eventDate}.`,
    type: 'reminder',
    link: `/booking/${bookingId}`
  });
}
