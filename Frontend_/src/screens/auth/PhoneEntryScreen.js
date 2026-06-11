import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, StatusBar, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert,
} from 'react-native';
import { sendOtp } from '../../utils/authApi';


export default function PhoneEntryScreen({ navigation, route }) {
  const { role } = route.params; // 'customer' | 'mechanic' | 'admin'
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfig = {
    customer:      { label: 'Customer',      color: '#22C55E' },
    mechanic:      { label: 'Mechanic',      color: '#38BDF8' },
    administrator: { label: 'Administrator', color: '#F43F5E' },
  };
  const { label, color } = roleConfig[role] ?? roleConfig.customer;

  const isValid = /^[6-9]\d{9}$/.test(phone);

  async function handleSendOtp() {
    if (!isValid) { setError('Enter a valid 10-digit Indian mobile number'); return; }
    setError('');
    setLoading(true);
    try {
      await sendOtp(phone, role);
      navigation.navigate('OtpVerify', { phone, role });
    } catch (err) {
      setError(err.message || 'Could not send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Role badge */}
      <View style={[styles.roleBadge, { borderColor: color }]}>
        <Text style={[styles.roleText, { color }]}>{label}</Text>
      </View>

      <Text style={styles.title}>Enter your mobile number</Text>
      <Text style={styles.subtitle}>
        We'll send a 4-digit OTP to verify your identity
      </Text>

      {/* Phone input */}
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        <View style={styles.countryCode}>
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={styles.dialCode}>+91</Text>
        </View>
        <View style={styles.divider} />
        <TextInput
          style={styles.phoneInput}
          value={phone}
          onChangeText={t => { setPhone(t.replace(/\D/g, '')); setError(''); }}
          placeholder="98765 43210"
          placeholderTextColor="#555"
          keyboardType="number-pad"
          maxLength={10}
          returnKeyType="done"
          onSubmitEditing={handleSendOtp}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.termsText}>
        By continuing, you agree to Mechiee's{' '}
        <Text style={{ color: '#22C55E' }}>Terms of Service</Text> and{' '}
        <Text style={{ color: '#22C55E' }}>Privacy Policy</Text>
      </Text>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: color }, (!isValid || loading) && styles.btnDisabled]}
        onPress={handleSendOtp}
        disabled={!isValid || loading}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Send OTP</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Change role</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 160, height: 44 },
  roleBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 20,
  },
  roleText: { fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    height: 56,
    marginBottom: 8,
  },
  inputError: { borderColor: '#F43F5E' },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 6,
  },
  flag: { fontSize: 18 },
  dialCode: { fontSize: 15, color: '#FFFFFF', fontWeight: '500' },
  divider: { width: 1, height: 28, backgroundColor: '#2A2A2A' },
  phoneInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 17,
    paddingHorizontal: 14,
    letterSpacing: 1,
  },
  errorText: { color: '#F43F5E', fontSize: 13, marginBottom: 12 },
  termsText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
    marginBottom: 28,
  },
  btn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backBtn: { alignItems: 'center', paddingVertical: 8 },
  backText: { color: '#555', fontSize: 14 },
});