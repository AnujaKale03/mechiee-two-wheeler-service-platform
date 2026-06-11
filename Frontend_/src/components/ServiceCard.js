import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, FONT_SIZE, RADIUS, SHADOW, SPACING } from "../utils/theme";

const SERVICE_CONFIG = {
  "Standard Service": { icon: "construct-outline",    color: COLORS.accent,          desc: "Oil change, filter cleaning & basic inspection" },
  "Premium Service":  { icon: "star-outline",         color: COLORS.warning,         desc: "Brake check, chain lube & full body inspection" },
  "Engine Repair":    { icon: "hardware-chip-outline", color: COLORS.info,           desc: "Full engine diagnostics & certified repair" },
};

export default function ServiceCard({ service, onPress }) {
  const cfg = SERVICE_CONFIG[service.name] || { icon: "build-outline", color: COLORS.accent, desc: "Professional doorstep service" };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${cfg.color}18` }]}>
        <Ionicons name={cfg.icon} size={24} color={cfg.color} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.desc}>{cfg.desc}</Text>
        {service.durationMins ? (
          <View style={styles.durationRow}>
            <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.duration}>~{service.durationMins} mins</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.priceWrap}>
        <Text style={styles.price}>₹{service.price}</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textDisabled} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.bgCard,
    marginHorizontal: SPACING.screen, marginBottom: SPACING.sm,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  iconWrap: {
    width: 50, height: 50, borderRadius: RADIUS.md,
    alignItems: "center", justifyContent: "center", marginRight: SPACING.md,
  },
  info:       { flex: 1 },
  name:       { fontSize: FONT_SIZE.base, ...FONTS.bold, color: COLORS.textPrimary },
  desc:       { fontSize: FONT_SIZE.xs, ...FONTS.regular, color: COLORS.textMuted, marginTop: 2, lineHeight: 16 },
  durationRow:{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  duration:   { fontSize: FONT_SIZE.xs, ...FONTS.medium, color: COLORS.textMuted },
  priceWrap:  { alignItems: "flex-end", gap: 4 },
  price:      { fontSize: FONT_SIZE.md, ...FONTS.extraBold, color: COLORS.accent },
});