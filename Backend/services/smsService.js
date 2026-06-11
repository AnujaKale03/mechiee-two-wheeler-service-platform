// services/smsService.js
// Install: npm install twilio
const twilio = require('twilio');

let client;
function getTwilio() {
  if (!client) {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return client;
}

const FROM = process.env.TWILIO_PHONE_NUMBER; // e.g. "+1234567890"

/**
 * Send an SMS message.
 * @param {string} toPhone  - Indian number e.g. "+919876543210"
 * @param {string} message
 * @returns {{ success: boolean, sid?: string, error?: string }}
 */
async function sendSms(toPhone, message) {
  if (!toPhone) return { success: false, error: 'No phone number' };

  // Normalize Indian numbers
  const normalized = toPhone.startsWith('+') ? toPhone : `+91${toPhone}`;

  try {
    const result = await getTwilio().messages.create({
      body: message,
      from: FROM,
      to: normalized,
    });
    return { success: true, sid: result.sid };
  } catch (err) {
    console.error('[SMS] Send error:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendSms };