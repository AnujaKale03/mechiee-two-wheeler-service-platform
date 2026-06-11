const { Expo } = require("expo-server-sdk");

const expo = new Expo();

const sendPushNotification = async (expoPushToken, title, body, data = {}) => {
  // Skip if no token provided (emulator / token not set)
  if (!expoPushToken || !Expo.isExpoPushToken(expoPushToken)) {
    console.log(`[Notifications] Skipped — invalid or missing token: ${expoPushToken}`);
    return;
  }

  const messages = [{ to: expoPushToken, sound: "default", title, body, data }];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log("[Notifications] Sent:", receipts);
    }
  } catch (error) {
    console.error("[Notifications] Error:", error.message);
  }
};

module.exports = { sendPushNotification };