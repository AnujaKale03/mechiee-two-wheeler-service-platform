import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING, STATUS_META } from "../utils/theme";

const NEXT_STATUS = {
  ASSIGNED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
};

const ACTION_LABEL = {
  IN_PROGRESS: "▶  Start Work",
  COMPLETED: "✓  Mark Complete",
};

export default function MechanicBookingCard({ booking, onUpdateStatus }) {
  const meta = STATUS_META[booking.status] || STATUS_META.ASSIGNED;
  const nextStatus = NEXT_STATUS[booking.status];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.customerName}>{booking.customerName}</Text>
          <Text style={styles.bikeModel}>🏍️  {booking.bikeModel}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: meta.bg }]}>
          <Text style={[styles.badgeText, { color: meta.color }]}>
            {meta.icon} {meta.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Info rows */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Service</Text>
        <Text style={styles.infoValue}>{booking.serviceId?.name || "N/A"}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Price</Text>
        <Text style={[styles.infoValue, { color: COLORS.primary }]}>
          ₹{booking.serviceId?.price || "—"}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Booking ID</Text>
        <Text style={styles.infoValue}>#{booking._id.slice(-6).toUpperCase()}</Text>
      </View>

      {/* Action button */}
      {nextStatus ? (
        <TouchableOpacity
          style={[
            styles.actionBtn,
            nextStatus === "COMPLETED" && styles.actionBtnComplete,
          ]}
          onPress={() => onUpdateStatus(booking._id, nextStatus)}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>{ACTION_LABEL[nextStatus]}</Text>
        </TouchableOpacity>
      ) : (
        booking.status === "COMPLETED" && (
          <View style={styles.completedRow}>
            <Text style={styles.completedText}>✅  Job Completed</Text>
          </View>
        )
      )}
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
    borderLeftWidth: 3,
    borderLeftColor: COLORS.mechanicAccent,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  customerName: { fontSize: 17, ...FONTS.bold, color: COLORS.textPrimary },
  bikeModel: { fontSize: 13, ...FONTS.medium, color: COLORS.textSecondary, marginTop: 3 },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  badgeText: { fontSize: 12, ...FONTS.bold },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.sm },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  infoLabel: { fontSize: 13, ...FONTS.medium, color: COLORS.textSecondary },
  infoValue: { fontSize: 13, ...FONTS.semiBold, color: COLORS.textPrimary },
  actionBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.mechanicAccent,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  actionBtnComplete: { backgroundColor: COLORS.success },
  actionBtnText: { fontSize: 15, ...FONTS.bold, color: COLORS.textInverse },
  completedRow: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  completedText: { fontSize: 14, ...FONTS.bold, color: COLORS.success },
});