// services/pushService.js
// Install: npm install firebase-admin
const admin = require('firebase-admin');

// Initialize once (call this in app.js before using)
let initialized = false;
function initFCM() {
  if (initialized) return;
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:    process.env.FCM_PROJECT_ID,
      clientEmail:  process.env.FCM_CLIENT_EMAIL,
      privateKey:   process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  initialized = true;
}

/**
 * Send FCM push to one device token.
 * @param {string} fcmToken  - Device FCM token stored on User model
 * @param {string} title
 * @param {string} body
 * @param {object} data      - Extra key-value pairs for deep linking
 * @returns {{ success: boolean, messageId?: string, error?: string }}
 */
async function sendPush(fcmToken, title, body, data = {}) {
  initFCM();

  if (!fcmToken) return { success: false, error: 'No FCM token' };

  const message = {
    token: fcmToken,
    notification: { title, body },
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ),
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'mechiee_alerts',
        icon: 'ic_notification',
        color: '#22C55E',
      },
    },
    apns: {
      payload: {
        aps: { sound: 'default', badge: 1 },
      },
    },
  };

  try {
    const messageId = await admin.messaging().send(message);
    return { success: true, messageId };
  } catch (err) {
    console.error('[FCM] Send error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send to multiple tokens at once (multicast).
 * @param {string[]} tokens
 */
async function sendPushMulticast(tokens, title, body, data = {}) {
  initFCM();
  if (!tokens?.length) return;

  const message = {
    tokens,
    notification: { title, body },
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ),
    android: { priority: 'high', notification: { channelId: 'mechiee_alerts', color: '#22C55E' } },
  };

  try {
    const res = await admin.messaging().sendEachForMulticast(message);
    return res;
  } catch (err) {
    console.error('[FCM] Multicast error:', err.message);
  }
}

module.exports = { sendPush, sendPushMulticast };