import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { getServices } from "../../services/serviceService";
import { createBooking } from "../../services/bookingService";
import { BOOKING_STATUS } from "../../utils/constants";
import { COLORS, FONTS, FONT_SIZE, RADIUS, SHADOW, SPACING } from "../../utils/theme";

// ── Push token helper ──────────────────────────────────────────────────────────
// expo-notifications is not supported in Expo Go (SDK 53+)
// Returns null safely in all Expo Go / non-device environments
const getCustomerPushToken = async () => {
  const isExpoGo = Constants.appOwnership === "expo";
  if (isExpoGo || !Device.isDevice) {
    console.log("[PushToken] Skipped — running in Expo Go or non-device.");
    return null;
  }

  try {
    // Only import dynamically when NOT in Expo Go (development build / production)
    const Notifications = await import("expo-notifications");

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") return null;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name:       "Default",
        importance: Notifications.AndroidImportance.MAX,
        sound:      "default",
      });
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.warn("[PushToken] No projectId found in app.json — token skipped.");
      return null;
    }

    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data;
  } catch (err) {
    console.warn("[PushToken] Failed to get push token:", err.message);
    return null;
  }
};

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function BookServiceScreen() {
  const [customerName, setCustomerName]       = useState("");
  const [bikeModel, setBikeModel]             = useState("");
  const [vehicleNumber, setVehicleNumber]     = useState("");
  const [services, setServices]               = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading]                 = useState(true);
  const [submitting, setSubmitting]           = useState(false);

  useEffect(() => {
    fetchServices();
    prefillProfile();
  }, []);

  const prefillProfile = async () => {
    try {
      const raw = await AsyncStorage.getItem("customerProfile");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.name)          setCustomerName(p.name);
        if (p.vehicleNumber) setVehicleNumber(p.vehicleNumber);
        if (p.bikeModel)     setBikeModel(p.bikeModel);
      }
    } catch {
      // Non-critical — silently ignore
    }
  };

  const fetchServices = async () => {
    try {
      const res = await getServices();
      setServices(res.data);
      if (res.data.length > 0) setSelectedService(res.data[0]._id);
    } catch {
      Toast.show({ type: "error", text1: "Network Error", text2: "Unable to load services." });
    } finally {
      setLoading(false);
    }
  };

  const selectedServiceObj = services.find((s) => s._id === selectedService);

  const handleBooking = async () => {
    if (customerName.trim().length < 3) {
      Toast.show({ type: "error", text1: "Validation", text2: "Name must be at least 3 characters." });
      return;
    }
    if (bikeModel.trim().length < 2) {
      Toast.show({ type: "error", text1: "Validation", text2: "Bike model is too short." });
      return;
    }
    if (vehicleNumber.trim().length < 4) {
      Toast.show({ type: "error", text1: "Validation", text2: "Enter a valid vehicle number (e.g. MH12AB1234)." });
      return;
    }
    if (!selectedService) {
      Toast.show({ type: "error", text1: "Validation", text2: "Please select a service." });
      return;
    }

    setSubmitting(true);
    try {
      const customerExpoPushToken = await getCustomerPushToken();
      const cleanVehicle          = vehicleNumber.toUpperCase().trim();

      const res = await createBooking({
        customerName:        customerName.trim(),
        bikeModel:           bikeModel.trim(),
        vehicleNumber:       cleanVehicle,
        serviceId:           selectedService,
        customerExpoPushToken,
      });

      const { status, paymentOrder, booking } = res.data;

      await AsyncStorage.setItem("customerProfile", JSON.stringify({
        name:          customerName.trim(),
        vehicleNumber: cleanVehicle,
        bikeModel:     bikeModel.trim(),
      }));

      if (status === BOOKING_STATUS.WAITLISTED) {
        Toast.show({
          type:  "info",
          text1: "Added to Waitlist ⏳",
          text2: "A mechanic will be assigned as soon as one is available.",
        });
      }else {
      Toast.show({
            type:  "success",
            text1: "Booking Confirmed! 🎉",
            text2: "Your mechanic has been assigned. Payment due after service.",
          });
        }

        resetForm();
       
    } catch (err) {
      Toast.show({
        type:  "error",
        text1: "Booking Failed",
        text2: err?.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setBikeModel("");
    setVehicleNumber("");
    if (services.length > 0) setSelectedService(services[0]._id);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loaderText}>Loading Services…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Book a Service</Text>
          <Text style={styles.pageSubtitle}>Fill in the details below to get started</Text>
        </View>

        <View style={styles.card}>
          {[
            { label: "Customer Name",  value: customerName,  setter: setCustomerName,  placeholder: "e.g. Rahul Sharma", icon: "person-outline",  caps: "words",      keyboard: "default" },
            { label: "Bike Model",     value: bikeModel,     setter: setBikeModel,     placeholder: "e.g. Activa 6G",    icon: "bicycle-outline", caps: "words",      keyboard: "default" },
            { label: "Vehicle Number", value: vehicleNumber, setter: setVehicleNumber, placeholder: "e.g. MH12AB1234",   icon: "card-outline",    caps: "characters", keyboard: "default" },
          ].map(({ label, value, setter, placeholder, icon, caps, keyboard }) => (
            <View key={label} style={styles.fieldWrap}>
              <Text style={styles.label}>{label}</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputIconWrap}>
                  <Ionicons name={icon} size={18} color={COLORS.textMuted} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={placeholder}
                  placeholderTextColor={COLORS.textDisabled}
                  value={value}
                  onChangeText={setter}
                  autoCapitalize={caps}
                  keyboardType={keyboard}
                />
              </View>
            </View>
          ))}

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Select Service</Text>
            {services.length === 0 ? (
              <View style={styles.emptyService}>
                <Ionicons name="alert-circle-outline" size={18} color={COLORS.warning} />
                <Text style={styles.emptyServiceText}>No services available</Text>
              </View>
            ) : (
              <View style={styles.pickerWrapper}>
                <Ionicons name="construct-outline" size={18} color={COLORS.textMuted} style={styles.pickerIcon} />
                <Picker
                  selectedValue={selectedService}
                  onValueChange={setSelectedService}
                  style={styles.picker}
                  dropdownIconColor={COLORS.textMuted}
                >
                  {services.map((s) => (
                    <Picker.Item
                      key={s._id}
                      label={`${s.name}  —  ₹${s.price}`}
                      value={s._id}
                      color={Platform.OS === "android" ? "#000000" : COLORS.textPrimary}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          {selectedServiceObj && (
            <View style={styles.summary}>
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryTag}>Selected</Text>
                <Text style={styles.summaryName}>{selectedServiceObj.name}</Text>
                <View style={styles.summaryMeta}>
                  <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.summaryDuration}>~{selectedServiceObj.durationMins} mins</Text>
                </View>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summaryPrice}>₹{selectedServiceObj.price}</Text>
                <Text style={styles.summaryPriceLabel}>incl. all charges</Text>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, (submitting || services.length === 0) && styles.submitDisabled]}
          onPress={handleBooking}
          disabled={submitting || services.length === 0}
          activeOpacity={0.88}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.textInverse} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textInverse} />
              <Text style={styles.submitText}>Confirm Booking</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.noteRow}>
          <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.note}>
            Mechanic auto-assigned · Payment collected after service completion
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll:        { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: SPACING.xxl },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg, gap: SPACING.sm },
  loaderText: { fontSize: FONT_SIZE.sm, ...FONTS.medium, color: COLORS.textMuted },
  pageHeader: { backgroundColor: COLORS.bgCard, paddingHorizontal: SPACING.screen, paddingTop: 52, paddingBottom: SPACING.xl + SPACING.lg, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  pageTitle: { fontSize: FONT_SIZE.xxxl, ...FONTS.extraBold, color: COLORS.textPrimary },
  pageSubtitle: { fontSize: FONT_SIZE.sm, ...FONTS.regular, color: COLORS.textMuted, marginTop: 4 },
  card: { backgroundColor: COLORS.bgCard, marginHorizontal: SPACING.screen, marginTop: SPACING.md, borderRadius: RADIUS.xl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.md },
  fieldWrap:  { marginBottom: SPACING.sm },
  label: { fontSize: FONT_SIZE.xs, ...FONTS.bold, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: SPACING.xs },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  inputIconWrap: { width: 44, height: 48, alignItems: "center", justifyContent: "center", borderRightWidth: 1, borderRightColor: COLORS.border },
  input: { flex: 1, height: 48, paddingHorizontal: SPACING.md, fontSize: FONT_SIZE.base, ...FONTS.medium, color: COLORS.textPrimary },
  pickerWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  pickerIcon: { paddingHorizontal: SPACING.sm, borderRightWidth: 1, borderRightColor: COLORS.border, paddingVertical: 14 },
  picker: { flex: 1, height: 50, color: COLORS.textPrimary },
  emptyService: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.warningBg, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.warningBorder },
  emptyServiceText: { fontSize: FONT_SIZE.sm, ...FONTS.medium, color: COLORS.warning },
  summary: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.accentBg, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderAccent },
  summaryLeft:  { flex: 1 },
  summaryTag: { fontSize: FONT_SIZE.xs, ...FONTS.bold, color: COLORS.accent, textTransform: "uppercase", letterSpacing: 0.8 },
  summaryName: { fontSize: FONT_SIZE.base, ...FONTS.bold, color: COLORS.textPrimary, marginTop: 2 },
  summaryMeta: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 },
  summaryDuration: { fontSize: FONT_SIZE.xs, ...FONTS.medium, color: COLORS.textMuted },
  summaryRight: { alignItems: "flex-end" },
  summaryPrice: { fontSize: FONT_SIZE.xxl, ...FONTS.extraBold, color: COLORS.accent },
  summaryPriceLabel: { fontSize: FONT_SIZE.xs, ...FONTS.regular, color: COLORS.textMuted, marginTop: 2 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.sm, marginHorizontal: SPACING.screen, marginTop: SPACING.md, backgroundColor: COLORS.accent, paddingVertical: SPACING.md + 2, borderRadius: RADIUS.lg, ...SHADOW.accent },
  submitDisabled: { opacity: 0.45 },
  submitText: { fontSize: FONT_SIZE.md, ...FONTS.bold, color: COLORS.textInverse },
  noteRow: { flexDirection: "row", alignItems: "center", gap: SPACING.xs, justifyContent: "center", marginTop: SPACING.md, paddingHorizontal: SPACING.xl },
  note: { fontSize: FONT_SIZE.xs, ...FONTS.regular, color: COLORS.textMuted, textAlign: "center", lineHeight: 16 },
});