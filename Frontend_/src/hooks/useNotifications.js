// hooks/useNotifications.js
import { useEffect, useCallback, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerExpoPushToken } from '../utils/notificationApi';
import { getAuthToken } from '../utils/storage';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

// Map notification type → screen
const TYPE_TO_SCREEN = {
  BOOKING_CONFIRMED: ['BookingDetail',  'bookingId'],
  BOOKING_CANCELLED: ['BookingHistory', null],
  MECHANIC_ASSIGNED: ['BookingDetail',  'bookingId'],
  MECHANIC_EN_ROUTE: ['TrackMechanic',  'bookingId'],
  SERVICE_COMPLETED: ['RateService',    'bookingId'],
  INVOICE_READY:     ['Invoice',        'bookingId'],
};

function buildNavParams(data) {
  const entry = TYPE_TO_SCREEN[data?.type];
  if (!entry) return null;
  const [screen, paramKey] = entry;
  const params = paramKey && data[paramKey] ? { [paramKey]: data[paramKey] } : {};
  return { screen, params };
}

export function useNotifications() {
  const navigation          = useNavigation();
  const notifListenerRef    = useRef(null);
  const responseListenerRef = useRef(null);

  const handleNotificationResponse = useCallback((response) => {
    const data = response.notification.request.content.data;
    const nav  = buildNavParams(data);
    if (nav) navigation.navigate(nav.screen, nav.params);
  }, [navigation]);

  useEffect(() => {
    async function setup() {
      // Expo Go (SDK 53+) no longer supports remote push notifications.
      // Skip token registration entirely — use a dev build for full support.
      const isExpoGo = Constants.appOwnership === 'expo';
      if (isExpoGo) {
        console.log('[Notifications] Skipped — Expo Go does not support push tokens in SDK 53+');
        return;
      }

      // Physical device check
      if (!Device.isDevice) {
        console.warn('[Notifications] Push tokens only work on physical devices.');
        return;
      }

      // Request permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.warn('[Notifications] Permission denied.');
        return;
      }

      // Android notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name:       'Default',
          importance: Notifications.AndroidImportance.MAX,
          sound:      'default',
        });
      }

      // Get Expo push token and register with backend
      try {
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ??
          Constants.easConfig?.projectId;

        if (!projectId) {
          console.warn('[Notifications] No projectId in app.json — token skipped.');
          return;
        }

        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });
        const authToken = await getAuthToken();
        if (expoPushToken && authToken) {
          await registerExpoPushToken(expoPushToken);
          console.log('[Notifications] Registered token:', expoPushToken);
        }
      } catch (err) {
        console.error('[Notifications] Token registration failed:', err.message);
      }

      // Foreground notification listener
      notifListenerRef.current = Notifications.addNotificationReceivedListener(notification => {
        console.log('[Notifications] Foreground:', notification);
      });

      // Tap listener — navigates on notification press
      responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );
    }

    setup();

    return () => {
      notifListenerRef.current?.remove();
      responseListenerRef.current?.remove();
    };
  }, [handleNotificationResponse]);
}