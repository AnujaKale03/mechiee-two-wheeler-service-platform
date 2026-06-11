import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { getBookings, cancelBooking } from "../../services/bookingService";
import BookingCard from "../../components/BookingCard";
import RatingModal from "../../components/RatingModal";
import { COLORS, FONTS, RADIUS, SPACING } from "../../utils/theme";

const FILTERS = ["All", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "WAITLISTED", "CANCELLED"];

export default function BookingHistoryScreen() {
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [error, setError]             = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [ratingBookingId, setRatingBookingId] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await getBookings();
      setBookings(res.data);
      setError("");
    } catch { setError("Failed to load bookings."); }
    finally { if (showLoader) setLoading(false); }
  };

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      fetchBookings(false);
    } catch (e) {
      setError(e?.response?.data?.message || "Could not cancel booking.");
    }
  };

  const filtered = activeFilter === "All"
    ? bookings
    : bookings.filter((b) => b.status === activeFilter);

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={COLORS.primaryDark} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</Text>
      </View>

      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        style={styles.filterRow}
        keyExtractor={(i) => i}
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

      {error ? <View style={styles.errorBox}><Text style={styles.errorText}>⚠️  {error}</Text></View> : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={async () => { setRefreshing(true); await fetchBookings(false); setRefreshing(false); }}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onCancel={["ASSIGNED", "WAITLISTED"].includes(item.status) ? () => handleCancel(item._id) : null}
            onRate={item.status === "COMPLETED" && !item.rating ? () => setRatingBookingId(item._id) : null}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Bookings Found</Text>
            <Text style={styles.emptyDesc}>{activeFilter === "All" ? "You haven't made any bookings yet." : `No "${activeFilter.replace("_", " ")}" bookings.`}</Text>
          </View>
        }
      />

      <RatingModal
        visible={!!ratingBookingId}
        bookingId={ratingBookingId}
        onClose={() => setRatingBookingId(null)}
        onSubmitted={() => fetchBookings(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.xxl, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  title: { fontSize: 28, ...FONTS.extraBold, color: COLORS.textOnPrimary },
  subtitle: { fontSize: 14, ...FONTS.regular, color: COLORS.textOnPrimaryMuted, marginTop: 4 },
  filterRow: { marginTop: -SPACING.md, marginBottom: SPACING.xs },
  filterList: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primaryDark, borderColor: COLORS.primaryDark },
  chipText: { fontSize: 13, ...FONTS.semiBold, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.textInverse },
  errorBox: { margin: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.errorBg, borderRadius: RADIUS.md },
  errorText: { fontSize: 13, ...FONTS.medium, color: COLORS.error },
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl, paddingTop: SPACING.sm },
  emptyBox: { alignItems: "center", paddingTop: SPACING.xxl },
  emptyIcon: { fontSize: 52, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 18, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  emptyDesc: { fontSize: 14, ...FONTS.regular, color: COLORS.textSecondary, textAlign: "center", lineHeight: 21 },
});