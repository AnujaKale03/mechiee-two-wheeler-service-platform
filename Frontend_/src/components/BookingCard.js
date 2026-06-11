import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING, STATUS_META } from "../utils/theme";

export default function BookingCard({ booking, onCancel, onRate }) {
  const meta = STATUS_META[booking.status] || STATUS_META.ASSIGNED;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.bookingId}>#{booking._id.slice(-6).toUpperCase()}</Text>
        <View style={[styles.badge, { backgroundColor: meta.bg, borderColor: meta.border }]}>
          <Text style={[styles.badgeText, { color: meta.color }]}>{meta.icon} {meta.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {[
        { icon: "🏍️", label: "Bike",           value: `${booking.bikeModel} · ${booking.vehicleNumber || ""}` },
        { icon: "🔧", label: "Service",         value: booking.serviceId?.name || "N/A" },
        { icon: "👷", label: "Mechanic",        value: booking.mechanicId?.name || "Not Assigned" },
        { icon: "👤", label: "Customer",        value: booking.customerName },
        { icon: "💰", label: "Payment",         value: booking.paymentStatus || "PENDING" },
      ].map(({ icon, label, value }) => (
        <View key={label} style={styles.row}>
          <Text style={styles.rowIcon}>{icon}</Text>
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
          </View>
        </View>
      ))}

      {booking.eta && (
        <View style={styles.etaBox}>
          <Text style={styles.etaText}>⏱ ETA: {booking.eta}</Text>
        </View>
      )}

      {booking.rating && (
        <View style={styles.ratingRow}>
          <Text style={styles.ratingStars}>{"★".repeat(booking.rating)}{"☆".repeat(5 - booking.rating)}</Text>
          {booking.ratingComment ? <Text style={styles.ratingComment}>"{booking.ratingComment}"</Text> : null}
        </View>
      )}

      <View style={styles.actionsRow}>
        {onRate && (
          <TouchableOpacity style={styles.rateBtn} onPress={onRate}>
            <Text style={styles.rateBtnText}>⭐ Rate Service</Text>
          </TouchableOpacity>
        )}
        {onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.border },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.sm },
  bookingId: { fontSize: 13, ...FONTS.bold, color: COLORS.textMuted, letterSpacing: 1 },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full, borderWidth: 1 },
  badgeText: { fontSize: 12, ...FONTS.bold },
  divider: { height: 1, backgroundColor: COLORS.borderLight, marginBottom: SPACING.sm },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: SPACING.xs, gap: SPACING.sm },
  rowIcon: { fontSize: 15, marginTop: 2 },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 11, ...FONTS.medium, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 },
  rowValue: { fontSize: 14, ...FONTS.semiBold, color: COLORS.textPrimary, marginTop: 1 },
  etaBox: { backgroundColor: COLORS.warningBg, borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: SPACING.xs, borderWidth: 1, borderColor: COLORS.warningBorder },
  etaText: { fontSize: 13, ...FONTS.semiBold, color: COLORS.warning },
  ratingRow: { marginTop: SPACING.xs, padding: SPACING.sm, backgroundColor: COLORS.warningBg, borderRadius: RADIUS.sm },
  ratingStars: { fontSize: 16, color: COLORS.warning },
  ratingComment: { fontSize: 12, ...FONTS.regular, color: COLORS.textSecondary, marginTop: 2, fontStyle: "italic" },
  actionsRow: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.sm },
  rateBtn: { flex: 1, backgroundColor: COLORS.primaryFaint, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, alignItems: "center", borderWidth: 1, borderColor: COLORS.primary },
  rateBtnText: { fontSize: 13, ...FONTS.bold, color: COLORS.primaryDark },
  cancelBtn: { flex: 1, backgroundColor: COLORS.errorBg, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, alignItems: "center", borderWidth: 1, borderColor: COLORS.errorBorder },
  cancelBtnText: { fontSize: 13, ...FONTS.bold, color: COLORS.error },
});