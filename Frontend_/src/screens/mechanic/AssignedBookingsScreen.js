import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, ActivityIndicator,
  StyleSheet, TouchableOpacity,
} from "react-native";
import { getBookings, updateBookingStatus } from "../services/bookingService";
import MechanicBookingCard from "../components/MechanicBookingCard";
import Toast from "react-native-toast-message";
import { COLORS, FONTS, RADIUS, SPACING } from "../utils/theme";

const FILTERS = ["All", "ASSIGNED", "IN_PROGRESS", "COMPLETED"];

export default function AssignedBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await getBookings();
      setBookings(response.data.filter((b) => b.status !== "WAITLISTED"));
      setError("");
    } catch {
      setError("Failed to load bookings.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings(false);
    setRefreshing(false);
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      await fetchBookings(false);
      Toast.show({
        type: "success",
        text1: "Status Updated",
        text2: `Booking marked as ${status.replace("_", " ")}`,
      });
    } catch {
      Toast.show({ type: "error", text1: "Update Failed", text2: "Please try again." });
    }
  };

  const filtered = activeFilter === "All"
    ? bookings
    : bookings.filter((b) => b.status === activeFilter);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.mechanicAccent} />
        <Text style={styles.loaderText}>Loading Assignments…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header — pastel sage */}
      <View style={styles.header}>
        <Text style={styles.title}>My Assignments</Text>
        <Text style={styles.subtitle}>{bookings.length} booking{bookings.length !== 1 ? "s" : ""} assigned</Text>
      </View>

      {/* Filter chips */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        style={styles.filterRow}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, activeFilter === item && styles.chipActive]}
            onPress={() => setActiveFilter(item)}
          >
            <Text style={[styles.chipText, activeFilter === item && styles.chipTextActive]}>
              {item === "All" ? "All" : item.replace("_", " ")}
            </Text>
          </TouchableOpacity>
        )}
      />

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️  {error}</Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MechanicBookingCard booking={item} onUpdateStatus={handleStatusUpdate} />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Assignments</Text>
            <Text style={styles.emptyDesc}>
              {activeFilter === "All"
                ? "You have no bookings assigned yet."
                : `No ${activeFilter.replace("_", " ")} bookings.`}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.bg },
  loaderText: { fontSize: 15, ...FONTS.medium, color: COLORS.textSecondary, marginTop: SPACING.sm },

  header: {
    backgroundColor: COLORS.mechanicAccentPastel,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl, paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    borderBottomWidth: 1.5, borderBottomColor: COLORS.mechanicAccentLight,
  },
  title: { fontSize: 28, ...FONTS.extraBold, color: COLORS.textOnMechanic },
  subtitle: { fontSize: 14, ...FONTS.regular, color: COLORS.textOnMechanicMuted, marginTop: 4 },

  filterRow: { marginTop: -SPACING.md, marginBottom: SPACING.xs },
  filterList: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.mechanicAccent, borderColor: COLORS.mechanicAccent },
  chipText: { fontSize: 13, ...FONTS.semiBold, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.textInverse },

  errorBox: {
    margin: SPACING.lg, padding: SPACING.md,
    backgroundColor: COLORS.errorBg, borderRadius: RADIUS.md,
  },
  errorText: { fontSize: 13, ...FONTS.medium, color: COLORS.error },

  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl, paddingTop: SPACING.sm },
  emptyBox: { alignItems: "center", paddingTop: SPACING.xxl },
  emptyIcon: { fontSize: 52, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 18, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  emptyDesc: {
    fontSize: 14, ...FONTS.regular, color: COLORS.textSecondary,
    textAlign: "center", lineHeight: 21,
  },
});