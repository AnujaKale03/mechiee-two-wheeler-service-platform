import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING, STATUS_META } from "../utils/theme";

export default function BookingCard({ booking }) {
  const meta = STATUS_META[booking.status] || STATUS_META.ASSIGNED; 

  return (
    <View style={styles.card}>
      {/* Top row */}
      <View style={styles.topRow}>
        <Text style={styles.bookingId}>#{booking._id.slice(-6).toUpperCase()}</Text>
        <View style={[styles.badge, { backgroundColor: meta.bg }]}>
          <Text style={[styles.badgeText, { color: meta.color }]}>
            {meta.icon} {meta.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Details */}
      <View style={styles.row}>
        <Text style={styles.rowIcon}>🏍️</Text>
        <View>
          <Text style={styles.rowLabel}>Bike</Text>
          <Text style={styles.rowValue}>{booking.bikeModel}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowIcon}>🔧</Text>
        <View>
          <Text style={styles.rowLabel}>Service</Text>
          <Text style={styles.rowValue}>{booking.serviceId?.name || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowIcon}>👷</Text>
        <View>
          <Text style={styles.rowLabel}>Mechanic</Text>
          <Text style={styles.rowValue}>{booking.mechanicId?.name || "Not Assigned"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.rowIcon}>👤</Text>
        <View>
          <Text style={styles.rowLabel}>Customer</Text>
          <Text style={styles.rowValue}>{booking.customerName}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  bookingId: {
    fontSize: 13,
    ...FONTS.bold,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  badgeText: { fontSize: 12, ...FONTS.bold },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },
  rowIcon: { fontSize: 16, marginTop: 2 },
  rowLabel: { fontSize: 11, ...FONTS.medium, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 },
  rowValue: { fontSize: 14, ...FONTS.semiBold, color: COLORS.textPrimary, marginTop: 1 },
});