import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING, STATUS_META } from "../utils/theme";
import { getMechanicImage } from "../utils/mechanicImages";

const NEXT_STATUS  = { ASSIGNED: "IN_PROGRESS", IN_PROGRESS: "COMPLETED" };
const ACTION_LABEL = { IN_PROGRESS: "▶  Start Work", COMPLETED: "✓  Mark Complete" };
const ACTION_COLOR = { IN_PROGRESS: COLORS.mechanicAccent, COMPLETED: COLORS.success };

export default function MechanicBookingCard({ booking, onUpdateStatus, onSetETA }) {
  const meta         = STATUS_META[booking.status] || STATUS_META.ASSIGNED;
  const nextStatus   = NEXT_STATUS[booking.status];
  const mechanicName = booking.mechanicId?.name;
  const image        = getMechanicImage(mechanicName);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {image
            ? <Image source={image} style={styles.miniAvatar} resizeMode="cover" />
            : <View style={styles.miniAvatarFallback}><Text style={styles.miniAvatarText}>{mechanicName?.[0] ?? "M"}</Text></View>
          }
          <View>
            <Text style={styles.customerName}>{booking.customerName}</Text>
            <Text style={styles.bikeModel}>🏍️  {booking.bikeModel}  ·  {booking.vehicleNumber || ""}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: meta.bg, borderColor: meta.border }]}>
          <Text style={[styles.badgeText, { color: meta.color }]}>{meta.icon} {meta.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        {[
          { label: "Service",    value: booking.serviceId?.name || "N/A" },
          { label: "Price",      value: `₹${booking.serviceId?.price || "—"}`, highlight: true },
          { label: "Booking ID", value: `#${booking._id.slice(-6).toUpperCase()}` },
          { label: "ETA",        value: booking.eta || "Not set" },
        ].map(({ label, value, highlight }) => (
          <View key={label} style={styles.infoItem}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={[styles.infoValue, highlight && { color: COLORS.primaryDark }]}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        {nextStatus && (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: ACTION_COLOR[nextStatus] }]} onPress={() => onUpdateStatus(booking._id, nextStatus)} activeOpacity={0.85}>
            <Text style={styles.actionBtnText}>{ACTION_LABEL[nextStatus]}</Text>
          </TouchableOpacity>
        )}
        {booking.status === "IN_PROGRESS" && onSetETA && (
          <TouchableOpacity style={styles.etaBtn} onPress={onSetETA} activeOpacity={0.85}>
            <Text style={styles.etaBtnText}>⏱ ETA</Text>
          </TouchableOpacity>
        )}
      </View>

      {booking.status === "COMPLETED" && (
        <View style={styles.completedRow}>
          <Text style={styles.completedText}>✅  Job Completed</Text>
          {booking.rating && <Text style={styles.ratingText}>{"★".repeat(booking.rating)}{"☆".repeat(5 - booking.rating)}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4, borderLeftColor: COLORS.mechanicAccentPastel },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: SPACING.sm },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, flex: 1, marginRight: SPACING.sm },
  miniAvatar: { width: 40, height: 40, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.mechanicAccentPastel },
  miniAvatarFallback: { width: 40, height: 40, borderRadius: RADIUS.full, backgroundColor: COLORS.mechanicAccentLight, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.mechanicAccentPastel },
  miniAvatarText: { fontSize: 16, ...FONTS.bold, color: COLORS.mechanicAccent },
  customerName: { fontSize: 16, ...FONTS.bold, color: COLORS.textPrimary },
  bikeModel: { fontSize: 12, ...FONTS.medium, color: COLORS.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full, borderWidth: 1 },
  badgeText: { fontSize: 11, ...FONTS.bold },
  divider: { height: 1, backgroundColor: COLORS.borderLight, marginBottom: SPACING.sm },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm, marginBottom: SPACING.sm },
  infoItem: { width: "47%" },
  infoLabel: { fontSize: 11, ...FONTS.medium, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 },
  infoValue: { fontSize: 14, ...FONTS.semiBold, color: COLORS.textPrimary, marginTop: 2 },
  actionsRow: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.xs },
  actionBtn: { flex: 1, paddingVertical: SPACING.sm + 2, borderRadius: RADIUS.md, alignItems: "center", ...SHADOW.xs },
  actionBtnText: { fontSize: 14, ...FONTS.bold, color: COLORS.textInverse },
  etaBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2, borderRadius: RADIUS.md, alignItems: "center", backgroundColor: COLORS.warningBg, borderWidth: 1, borderColor: COLORS.warningBorder },
  etaBtnText: { fontSize: 14, ...FONTS.bold, color: COLORS.warning },
  completedRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: SPACING.xs, padding: SPACING.sm, backgroundColor: COLORS.successBg, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.successBorder },
  completedText: { fontSize: 14, ...FONTS.bold, color: COLORS.success },
  ratingText: { fontSize: 16, color: COLORS.warning },
});