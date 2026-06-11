import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, ActivityIndicator, Keyboard,
} from 'react-native';
import { verifyOtp, sendOtp } from "../../utils/authApi";
import { saveAuthToken } from '../../utils/storage';

const OTP_LENGTH = 4;

export default function OtpVerifyScreen({ navigation, route }) {
  const { phone, role } = route.params;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  const roleColor = { customer: '#22C55E', mechanic: '#38BDF8', administrator: '#F43F5E' };
  const color = roleColor[role] ?? '#22C55E';

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleChange(val, idx) {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = cleaned;
    setOtp(next);
    setError('');
    if (cleaned && idx < OTP_LENGTH - 1) inputs.current[idx + 1]?.focus();
  }

  function handleKeyPress(e, idx) {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
      const next = [...otp];
      next[idx - 1] = '';
      setOtp(next);
    }
  }

  async function handleVerify() {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { setError('Enter the complete 4-digit OTP'); return; }
    Keyboard.dismiss();
    setLoading(true);
    setError('');
    try {
      const { token, user } = await verifyOtp(phone, code, role);
      await saveAuthToken(token);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthSuccess', params: { user, role } }],
      });
    } catch (err) {
      setError(err.message || 'Incorrect OTP. Please try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setCanResend(false);
    setCountdown(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    try {
      await sendOtp(phone, role);
    } catch {
      setError('Could not resend OTP. Try again.');
    }
  }

  const maskedPhone = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <View style={[styles.iconWrap, { borderColor: color }]}>
        <Text style={{ fontSize: 28 }}>💬</Text>
      </View>

      <Text style={styles.title}>Verify your number</Text>
      <Text style={styles.subtitle}>
        OTP sent to{' '}
        <Text style={styles.phoneHighlight}>{maskedPhone}</Text>
      </Text>

      {/* OTP Boxes */}
      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={r => (inputs.current[i] = r)}
            style={[
              styles.otpBox,
              digit ? [styles.otpFilled, { borderColor: color }] : null,
              error ? styles.otpError : null,
            ]}
            value={digit}
            onChangeText={v => handleChange(v, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectionColor={color}
            caretHidden
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Resend */}
      <View style={styles.resendRow}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={[styles.resendActive, { color }]}>Resend OTP</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.resendCooldown}>
            Resend in{' '}
            <Text style={{ color: '#888' }}>
              0:{String(countdown).padStart(2, '0')}
            </Text>
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: color },
          (otp.join('').length < OTP_LENGTH || loading) && styles.btnDisabled,
        ]}
        onPress={handleVerify}
        disabled={otp.join('').length < OTP_LENGTH || loading}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Verify &amp; Continue</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changeBtn}>
        <Text style={styles.changeText}>Change number</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backBtn: { marginBottom: 32 },
  backArrow: { fontSize: 22, color: '#888' },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 36, lineHeight: 20 },
  phoneHighlight: { color: '#FFFFFF', fontWeight: '600' },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    justifyContent: 'center',
  },
  otpBox: {
    width: 64,
    height: 68,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2A2A2A',
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  otpFilled: { backgroundColor: '#1A1A1A' },
  otpError: { borderColor: '#F43F5E' },
  errorText: {
    color: '#F43F5E',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  resendRow: { alignItems: 'center', marginBottom: 32, marginTop: 8 },
  resendCooldown: { fontSize: 14, color: '#555' },
  resendActive: { fontSize: 14, fontWeight: '600' },
  btn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  changeBtn: { alignItems: 'center', paddingVertical: 8 },
  changeText: { color: '#555', fontSize: 14 },
});