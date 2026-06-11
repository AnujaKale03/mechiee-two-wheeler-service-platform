// components/InAppNotificationBanner.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';

const TYPE_META = {
  BOOKING_CONFIRMED: { icon: '🎉', color: '#22C55E' },
  BOOKING_CANCELLED: { icon: '❌', color: '#F43F5E' },
  MECHANIC_ASSIGNED: { icon: '🔧', color: '#38BDF8' },
  MECHANIC_EN_ROUTE: { icon: '🚗', color: '#F59E0B' },
  SERVICE_COMPLETED: { icon: '✅', color: '#22C55E' },
  INVOICE_READY: { icon: '🧾', color: '#A78BFA' },
};

const BANNER_DURATION = 4000;

export function InAppNotificationBanner({ onPress }) {
  const [notification, setNotification] = useState(null);
  const translateY = useRef(new Animated.Value(-120)).current;
  const timer = useRef(null);

  const show = (msg) => {
    setNotification(msg);

    clearTimeout(timer.current);

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();

    timer.current = setTimeout(dismiss, BANNER_DURATION);
  };

  const dismiss = () => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setNotification(null));
  };

  // Firebase removed temporarily
  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy < -5,
      onPanResponderRelease: (_, g) => {
        if (g.dy < -10) dismiss();
      },
    })
  ).current;

  if (!notification) return null;

  const type = notification?.data?.type;

  const meta =
    TYPE_META[type] || {
      icon: '🔔',
      color: '#22C55E',
    };

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={[styles.inner, { borderLeftColor: meta.color }]}
        onPress={() => {
          dismiss();
          onPress?.(notification);
        }}
        activeOpacity={0.9}
      >
        <Text style={styles.icon}>{meta.icon}</Text>

        <View style={styles.texts}>
          <Text style={styles.title} numberOfLines={1}>
            {notification?.notification?.title || 'Mechiee'}
          </Text>

          <Text style={styles.body} numberOfLines={2}>
            {notification?.notification?.body}
          </Text>
        </View>

        <TouchableOpacity
          onPress={dismiss}
          style={styles.close}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: 44,
    paddingHorizontal: 12,
  },

  inner: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    borderLeftWidth: 4,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },

  icon: {
    fontSize: 24,
  },

  texts: {
    flex: 1,
  },

  title: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },

  body: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },

  close: {
    padding: 4,
  },

  closeText: {
    color: '#555',
    fontSize: 14,
  },
});