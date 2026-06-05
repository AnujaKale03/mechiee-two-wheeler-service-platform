import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { getServices } from "../services/serviceService";
import { createBooking } from "../services/bookingService";
import { BOOKING_STATUS } from "../utils/constants";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../utils/theme";

export default function BookServiceScreen() {
  const [customerName, setCustomerName] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getServices();
      setServices(response.data);
      if (response.data.length > 0) setSelectedService(response.data[0]._id);
    } catch {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Unable to load services. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };
  //Selected Service Object
  const selectedServiceObj = services.find((s) => s._id === selectedService);

  const handleBooking = async () => {
    if (customerName.trim().length < 3) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Customer name must be at least 3 characters" });
      return;
    }
    if (bikeModel.trim().length < 2) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Bike model is too short" });
      return;
    }
    if (!selectedService) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Please select a service" });
      return;
    }

    setSubmitting(true);
    try {
      const response = await createBooking({ customerName, bikeModel, serviceId: selectedService });
      const { status, message } = response.data;

      Toast.show({
        type: status === BOOKING_STATUS.WAITLISTED ? "error" : "success",
        text1: status === BOOKING_STATUS.WAITLISTED ? "Added to Waitlist" : "Booking Confirmed! 🎉",
        text2: message,
      });

      setCustomerName("");
      setBikeModel("");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: error?.response?.data?.message || "Unable to create booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loaderText}>Loading Services…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Page header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Book a Service</Text>
          <Text style={styles.pageSubtitle}>Fill in the details below to get started</Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          {/* Customer name */}
          <Text style={styles.label}>Customer Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Rahul Sharma"
            placeholderTextColor={COLORS.textMuted}
            value={customerName}
            onChangeText={setCustomerName}
          />

          {/* Bike model */}
          <Text style={styles.label}>Bike Model</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Activa 6G"
            placeholderTextColor={COLORS.textMuted}
            value={bikeModel}
            onChangeText={setBikeModel}
          />

          {/* Service picker */}
          <Text style={styles.label}>Select Service</Text>
          {services.length === 0 ? (
            <View style={styles.emptyService}>
              <Text style={styles.emptyServiceText}>⚠️ No services available</Text>
            </View>
          ) : (
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedService}
                onValueChange={(value) => setSelectedService(value)}
                style={styles.picker}
              >
                {services.map((service) => (
                  <Picker.Item
                    key={service._id}
                    label={`${service.name}  —  ₹${service.price}`}
                    value={service._id}
                  />
                ))}
              </Picker>
            </View>
          )}

          {/* Selected service summary */}
          {selectedServiceObj && (
            <View style={styles.summary}>
              <View>
                <Text style={styles.summaryLabel}>Selected</Text>
                <Text style={styles.summaryService}>{selectedServiceObj.name}</Text>
              </View>
              <Text style={styles.summaryPrice}>₹{selectedServiceObj.price}</Text>
            </View>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, (submitting || services.length === 0) && styles.submitDisabled]}
          onPress={handleBooking}
          disabled={submitting || services.length === 0}
          activeOpacity={0.88}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.textInverse} />
          ) : (
            <Text style={styles.submitText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          A mechanic will be assigned to you automatically.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: SPACING.xxl },
  loader: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: COLORS.bg, gap: SPACING.sm,
  },
  loaderText: { fontSize: 15, ...FONTS.medium, color: COLORS.textSecondary, marginTop: SPACING.sm },
  pageHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  pageTitle: { fontSize: 28, ...FONTS.extraBold, color: COLORS.textInverse },
  pageSubtitle: { fontSize: 14, ...FONTS.regular, color: "rgba(255,255,255,0.82)", marginTop: 4 },
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOW.lg,
  },
  label: {
    fontSize: 13,
    ...FONTS.semiBold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 15,
    ...FONTS.medium,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.bg,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    backgroundColor: COLORS.bg,
  },
  picker: { height: 52, color: COLORS.textPrimary },
  emptyService: {
    padding: SPACING.md,
    backgroundColor: COLORS.warningBg,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  emptyServiceText: { fontSize: 14, ...FONTS.medium, color: COLORS.warning },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryFaint,
    borderRadius: RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  summaryLabel: { fontSize: 12, ...FONTS.medium, color: COLORS.primaryDark },
  summaryService: { fontSize: 15, ...FONTS.bold, color: COLORS.textPrimary, marginTop: 2 },
  summaryPrice: { fontSize: 20, ...FONTS.extraBold, color: COLORS.primary },
  submitBtn: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    ...SHADOW.md,
  },
  submitDisabled: { opacity: 0.55 },
  submitText: { fontSize: 16, ...FONTS.bold, color: COLORS.textInverse },
  note: {
    textAlign: "center",
    fontSize: 13,
    ...FONTS.regular,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
});