// services/notificationService.js
const Notification = require('../models/Notification');
const { sendPush }  = require('./pushService');
const { sendSms }   = require('./smsService');

// ─── Message Templates ────────────────────────────────────────────────────────
const TEMPLATES = {
  BOOKING_CONFIRMED: (booking) => ({
    title: '🎉 Booking Confirmed!',
    body:  `Your booking #${booking.bookingId} for ${booking.serviceType} is confirmed.`,
    sms:   `[Mechiee] Booking #${booking.bookingId} confirmed! Service: ${booking.serviceType} on ${booking.scheduledDate}. Track on app.`,
  }),
  BOOKING_CANCELLED: (booking) => ({
    title: '❌ Booking Cancelled',
    body:  `Booking #${booking.bookingId} has been cancelled. Tap to rebook.`,
    sms:   `[Mechiee] Booking #${booking.bookingId} was cancelled. Need help? Call 1800-XXX-XXXX or rebook on the app.`,
  }),
  MECHANIC_ASSIGNED: (booking) => ({
    title: '🔧 Mechanic Assigned',
    body:  `${booking.mechanicName} will handle your ${booking.serviceType}. ETA: ${booking.eta}.`,
    sms:   `[Mechiee] ${booking.mechanicName} (⭐ ${booking.mechanicRating}) assigned to your booking #${booking.bookingId}. ETA: ${booking.eta}.`,
  }),
  MECHANIC_EN_ROUTE: (booking) => ({
    title: '🚗 Mechanic On the Way',
    body:  `${booking.mechanicName} is heading to you. Track live in the app.`,
    sms:   `[Mechiee] Your mechanic ${booking.mechanicName} is on the way! Track live: ${booking.trackingUrl}`,
  }),
  SERVICE_COMPLETED: (booking) => ({
    title: '✅ Service Completed',
    body:  `Your ${booking.serviceType} is done. How was your experience?`,
    sms:   `[Mechiee] Service completed for booking #${booking.bookingId}. Invoice: ₹${booking.totalAmount}. Rate your experience on the app.`,
  }),
  INVOICE_READY: (booking) => ({
    title: '🧾 Invoice Ready',
    body:  `Invoice of ₹${booking.totalAmount} for booking #${booking.bookingId} is ready.`,
    sms:   `[Mechiee] Invoice ready! Booking #${booking.bookingId} | Amount: ₹${booking.totalAmount} | View on app.`,
  }),
};

// ─── Core Dispatcher ─────────────────────────────────────────────────────────
/**
 * Dispatch a notification for a booking event.
 *
 * @param {object} params
 * @param {string} params.type          - One of TEMPLATES keys
 * @param {object} params.recipient     - User document (has _id, role, fcmToken, phone)
 * @param {object} params.bookingData   - Plain object with booking fields for template
 * @param {string} params.bookingId     - MongoDB ObjectId of the booking (for DB ref)
 * @param {boolean} [params.push=true]
 * @param {boolean} [params.sms=true]
 */
async function dispatch({ type, recipient, bookingData, bookingId, push = true, sms = true }) {
  const template = TEMPLATES[type];
  if (!template) throw new Error(`Unknown notification type: ${type}`);

  const { title, body, sms: smsText } = template(bookingData);

  // Save to DB first
  const notification = await Notification.create({
    recipient: recipient._id,
    role:      recipient.role,
    type,
    title,
    body,
    booking:   bookingId || null,
    channels: {
      push: { sent: false },
      sms:  { sent: false },
    },
  });

  const updates = {};

  // Push notification
  if (push && recipient.fcmToken) {
    const pushResult = await sendPush(
      recipient.fcmToken,
      title,
      body,
      {
        type,
        bookingId: String(bookingId || ''),
        screen:    resolveScreen(type),
      }
    );
    updates['channels.push.sent']   = pushResult.success;
    updates['channels.push.sentAt'] = new Date();
  }

  // SMS
  if (sms && recipient.phone) {
    const smsResult = await sendSms(recipient.phone, smsText);
    updates['channels.sms.sent']   = smsResult.success;
    updates['channels.sms.sentAt'] = new Date();
  }

  // Persist delivery status
  await Notification.findByIdAndUpdate(notification._id, { $set: updates });

  return notification;
}

// ─── Convenience Wrappers ────────────────────────────────────────────────────
const notifyBookingConfirmed = (recipient, bookingData, bookingId) =>
  dispatch({ type: 'BOOKING_CONFIRMED', recipient, bookingData, bookingId });

const notifyBookingCancelled = (recipient, bookingData, bookingId) =>
  dispatch({ type: 'BOOKING_CANCELLED', recipient, bookingData, bookingId });

const notifyMechanicAssigned = (recipient, bookingData, bookingId) =>
  dispatch({ type: 'MECHANIC_ASSIGNED', recipient, bookingData, bookingId });

const notifyMechanicEnRoute = (recipient, bookingData, bookingId) =>
  dispatch({ type: 'MECHANIC_EN_ROUTE', recipient, bookingData, bookingId });

const notifyServiceCompleted = (recipient, bookingData, bookingId) =>
  dispatch({ type: 'SERVICE_COMPLETED', recipient, bookingData, bookingId });

const notifyInvoiceReady = (recipient, bookingData, bookingId) =>
  dispatch({ type: 'INVOICE_READY', recipient, bookingData, bookingId });

// ─── Deep Link Screen Resolver ───────────────────────────────────────────────
function resolveScreen(type) {
  const map = {
    BOOKING_CONFIRMED:  'BookingDetail',
    BOOKING_CANCELLED:  'BookingHistory',
    MECHANIC_ASSIGNED:  'BookingDetail',
    MECHANIC_EN_ROUTE:  'TrackMechanic',
    SERVICE_COMPLETED:  'RateService',
    INVOICE_READY:      'Invoice',
  };
  return map[type] || 'Home';
}

module.exports = {
  dispatch,
  notifyBookingConfirmed,
  notifyBookingCancelled,
  notifyMechanicAssigned,
  notifyMechanicEnRoute,
  notifyServiceCompleted,
  notifyInvoiceReady,
};