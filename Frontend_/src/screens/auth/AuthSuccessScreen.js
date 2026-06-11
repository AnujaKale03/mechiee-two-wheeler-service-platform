import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated,
} from 'react-native';

export default function AuthSuccessScreen({ navigation, route }) {
  const { user, role } = route.params;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const roleConfig = {
    customer:      { color: '#22C55E', destination: 'Customer',      label: 'Go to Home' },
    mechanic:      { color: '#38BDF8', destination: 'MechanicApp', label: 'Go to Dashboard' },
    administrator: { color: '#F43F5E', destination: 'AdminApp',        label: 'Go to Admin Panel' },
  };
  const { color, destination, label } = roleConfig[role] ?? roleConfig.customer;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

      <Animated.View style={[styles.center, { opacity }]}>
        {/* Animated check circle */}
        <Animated.View style={[styles.checkWrap, { borderColor: color, transform: [{ scale }] }]}>
          <Text style={[styles.checkIcon, { color }]}>✓</Text>
        </Animated.View>

        <Text style={styles.title}>You're verified!</Text>
        <Text style={styles.subtitle}>Welcome to Mechiee</Text>

        {/* User card */}
        <View style={[styles.userCard, { borderColor: color + '44' }]}>
          <View style={[styles.avatar, { backgroundColor: color + '22' }]}>
            <Text style={[styles.avatarText, { color }]}>
              {(user?.name || user?.phone || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'New User'}</Text>
            <Text style={styles.userPhone}>+91 {user?.phone}</Text>
          </View>
          <View style={[styles.rolePill, { backgroundColor: color + '22', borderColor: color + '55' }]}>
            <Text style={[styles.rolePillText, { color }]}>{role}</Text>
          </View>
        </View>
      </Animated.View>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: color }]}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: destination }] })}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  checkWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#1A1A1A',
  },
  checkIcon: { fontSize: 36, fontWeight: '700' },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: '#888', marginBottom: 36 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    width: '100%',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700' },
  userInfo: { flex: 1 },
  userName: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  userPhone: { color: '#888', fontSize: 13, marginTop: 2 },
  rolePill: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rolePillText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  btn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});