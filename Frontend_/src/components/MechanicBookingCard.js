import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING, STATUS_META } from "../utils/theme";
import { getMechanicImage } from "../utils/mechanicImages";

const NEXT_STATUS = {
  ASSIGNED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
};

const ACTION_LABEL = {
  IN_PROGRESS: "▶  Start Work",
  COMPLETED:   "✓  Mark Complete",
};

const ACTION_COLOR = {
  IN_PROGRESS: COLORS.mechanicAccent,
  COMPLETED:   COLORS.success,
};

export default function MechanicBookingCard({ booking, onUpdateStatus }) {
  const meta = STATUS_META[booking.status] || STATUS_META.ASSIGNED;
  const nextStatus = NEXT_STATUS[booking.status];
  const mechanicName = booking.mechanicId?.name;
  const image = getMechanicImage(mechanicName);

  return (
    <View style={styles.card}>
      {/* Header row — customer + status badge */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Mechanic mini-avatar */}
          {image ? (
            <Image source={image} style={styles.miniAvatar} resizeMode="cover" />
          ) : (
            <View style={styles.miniAvatarFallback}>
              <Text style={styles.miniAvatarText}>
                {mechanicName?.[0] ?? "M"}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.customerName}>{booking.customerName}</Text>
            <Text style={styles.bikeModel}>🏍️  {booking.bikeModel}</Text>
          </View>
        </View>
        <View style={[styles.badge, {
          backgroundColor: meta.bg,
          borderColor: meta.border,
        }]}>
          <Text style={[styles.badgeText, { color: meta.color }]}>
            {meta.icon} {meta.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Info grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Service</Text>
          <Text style={styles.infoValue}>{booking.serviceId?.name || "N/A"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Price</Text>
          <Text style={[styles.infoValue, { color: COLORS.primary }]}>
            ₹{booking.serviceId?.price || "—"}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Mechanic</Text>
          <Text style={styles.infoValue}>{mechanicName || "Unassigned"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Booking ID</Text>
          <Text style={styles.infoValue}>#{booking._id.slice(-6).toUpperCase()}</Text>
        </View>
      </View>

      {/* Action button */}
      {nextStatus ? (
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: ACTION_COLOR[nextStatus] }]}
          onPress={() => onUpdateStatus(booking._id, nextStatus)}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>{ACTION_LABEL[nextStatus]}</Text>
        </TouchableOpacity>
      ) : booking.status === "COMPLETED" ? (
        <View style={styles.completedRow}>
          <Text style={styles.completedText}>✅  Job Completed</Text>
        </View>
      ) : null}
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
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.mechanicAccent,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
    marginRight: SPACING.sm,
  },

  miniAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.mechanicAccentLight,
  },
  miniAvatarFallback: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.mechanicAccentLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.mechanicAccent,
  },
  miniAvatarText: { fontSize: 16, ...FONTS.bold, color: COLORS.mechanicAccent },

  customerName: { fontSize: 16, ...FONTS.bold, color: COLORS.textPrimary },
  bikeModel: { fontSize: 12, ...FONTS.medium, color: COLORS.textSecondary, marginTop: 2 },

  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeText: { fontSize: 11, ...FONTS.bold },

  divider: { height: 1, backgroundColor: COLORS.borderLight, marginBottom: SPACING.sm },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  infoItem: { width: "47%" },
  infoLabel: {
    fontSize: 11, ...FONTS.medium,
    color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5,
  },
  infoValue: { fontSize: 14, ...FONTS.semiBold, color: COLORS.textPrimary, marginTop: 2 },

  actionBtn: {
    marginTop: SPACING.xs,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    alignItems: "center",
    ...SHADOW.xs,
  },
  actionBtnText: { fontSize: 15, ...FONTS.bold, color: COLORS.textInverse },

  completedRow: {
    marginTop: SPACING.xs,
    padding: SPACING.sm,
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    alignItems: "center",
  },
  completedText: { fontSize: 14, ...FONTS.bold, color: COLORS.success },
});