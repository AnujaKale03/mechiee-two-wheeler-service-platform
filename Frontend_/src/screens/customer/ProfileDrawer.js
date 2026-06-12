import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, Animated, Dimensions, StatusBar, Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { getBookings } from "../../services/bookingService";
import { COLORS, FONTS, FONT_SIZE, RADIUS, SHADOW, SPACING } from "../../utils/theme";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.82;

const MENU_ITEMS = [
  {
    section: null,
    items: [
      { key: "bookings",  icon: "receipt-outline",              label: "My Bookings"     },
      { key: "book",      icon: "add-circle-outline",           label: "Book a Service"  },
      { key: "payments",  icon: "wallet-outline",               label: "Payment History" },
    ],
  },
  {
    section: "SUPPORT",
    items: [
      { key: "notifications", icon: "notifications-outline",    label: "Notifications",  badge: "ON"  },
      { key: "support",       icon: "headset-outline",          label: "Help & Support"              },
      { key: "about",         icon: "information-circle-outline",label: "About Mechiee", badge: "1.0" },
    ],
  },
  {
    section: "ACCOUNT",
    items: [
      { key: "logout", icon: "log-out-outline", label: "Sign Out", danger: true },
    ],
  },
];

export default function ProfileDrawer({ visible, onClose, navigation }) {
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
  const [bgAnim]    = useState(new Animated.Value(0));
  const [profile, setProfile] = useState({ name: "Customer", vehicleNumber: "" });
  const [stats, setStats]     = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    if (visible) {
      loadProfile();
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 0, speed: 20 }),
        Animated.timing(bgAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
        Animated.timing(bgAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const loadProfile = async () => {
    try {
      const raw = await AsyncStorage.getItem("customerProfile");
      if (raw) setProfile(JSON.parse(raw));
      const res = await getBookings();
      const all = res.data || [];
      setStats({
        total:     all.length,
        completed: all.filter(b => b.status === "COMPLETED").length,
        pending:   all.filter(b => ["ASSIGNED","IN_PROGRESS","WAITLISTED"].includes(b.status)).length,
      });
    } catch {}
  };

  const handleItem = (key) => {
    onClose();
    setTimeout(() => {
      switch (key) {
        case "bookings":
          navigation.navigate("Bookings");
          break;
        case "book":
          navigation.navigate("Book Service");
          break;
        case "payments":
          Alert.alert("Payment History", "Payment history will show your completed service payments.\n\nComing soon in next update.");
          break;
        case "notifications":
          Alert.alert("Notifications", "Push notifications are enabled for booking updates and mechanic arrival alerts.");
          break;
        case "support":
          Alert.alert("Help & Support", "For support, contact us at:\nsupport@mechiee.com\n\nResponse within 24 hours.");
          break;
        case "about":
          Alert.alert("About Mechiee", "Mechiee v1.0.0\n\nYour trusted doorstep bike service platform.\n\n© 2024 Mechiee. All rights reserved.");
          break;
        case "logout":
          handleLogout();
          break;
      }
    }, 200);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "customerSession", "customerProfile",
        "authToken", "authUser", "authRole",
      ]);
      navigation.getParent()?.reset({ index: 0, routes: [{ name: "Welcome" }] });
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const bgOpacity = bgAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const initials  = profile.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "CU";

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.75)" />

      <Animated.View style={[styles.overlay, { opacity: bgOpacity }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

          {/* Profile header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{initials}</Text>
              <View style={styles.onlineDot} />
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <View style={styles.rolePill}>
              <Ionicons name="person" size={11} color={COLORS.accent} />
              <Text style={styles.roleText}>Customer</Text>
            </View>
            {profile.vehicleNumber ? (
              <View style={styles.vehicleChip}>
                <Ionicons name="bicycle" size={13} color={COLORS.textMuted} />
                <Text style={styles.vehicleText}>{profile.vehicleNumber}</Text>
              </View>
            ) : null}
          </View>

          {/* Stats strip */}
          <View style={styles.statsRow}>
            {[
              { label: "Total",  value: stats.total },
              { label: "Done",   value: stats.completed },
              { label: "Active", value: stats.pending },
            ].map(({ label, value }) => (
              <View key={label} style={styles.statItem}>
                <Text style={styles.statNum}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Menu */}
          <View style={styles.menuWrap}>
            {MENU_ITEMS.map(({ section, items }, si) => (
              <View key={si} style={styles.menuSection}>
                {section ? <Text style={styles.sectionLabel}>{section}</Text> : null}
                {items.map(({ key, icon, label, badge, danger }) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.menuRow}
                    onPress={() => handleItem(key)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuIconWrap, danger && styles.menuIconDanger]}>
                      <Ionicons name={icon} size={20} color={danger ? COLORS.error : COLORS.accent} />
                    </View>
                    <Text style={[styles.menuLabel, danger && { color: COLORS.error }]}>{label}</Text>
                    {badge ? (
                      <View style={[styles.menuBadge, badge === "ON" && styles.menuBadgeGreen]}>
                        <Text style={styles.menuBadgeText}>{badge}</Text>
                      </View>
                    ) : !danger ? (
                      <Ionicons name="chevron-forward" size={16} color={COLORS.textDisabled} />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <Text style={styles.version}>Mechiee v1.0.0</Text>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.overlay },
  drawer:  { position: "absolute", top: 0, left: 0, bottom: 0, width: DRAWER_WIDTH, backgroundColor: COLORS.bgCard, borderTopRightRadius: RADIUS.xl, borderBottomRightRadius: RADIUS.xl, ...SHADOW.lg },
  profileHeader: { backgroundColor: COLORS.bgElevated, paddingTop: 56, paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  closeBtn: { position: "absolute", top: 16, right: SPACING.md, width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: COLORS.bgSection, alignItems: "center", justifyContent: "center" },
  avatarWrap: { width: 72, height: 72, borderRadius: RADIUS.full, backgroundColor: COLORS.accentBg, borderWidth: 2, borderColor: COLORS.accent, alignItems: "center", justifyContent: "center", marginBottom: SPACING.sm, position: "relative" },
  avatarText: { fontSize: 26, ...FONTS.bold, color: COLORS.accent },
  onlineDot: { position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: RADIUS.full, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.bgElevated },
  profileName: { fontSize: FONT_SIZE.xl, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.xs },
  rolePill: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", backgroundColor: COLORS.accentMuted, paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full, marginBottom: SPACING.sm },
  roleText: { fontSize: FONT_SIZE.xs, ...FONTS.bold, color: COLORS.accent },
  vehicleChip: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: COLORS.bgSection, paddingHorizontal: SPACING.sm, paddingVertical: 5, borderRadius: RADIUS.sm, alignSelf: "flex-start", borderWidth: 1, borderColor: COLORS.border },
  vehicleText: { fontSize: FONT_SIZE.sm, ...FONTS.medium, color: COLORS.textSecondary },
  statsRow: { flexDirection: "row", paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.bgCard },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: FONT_SIZE.xxl, ...FONTS.extraBold, color: COLORS.accent },
  statLabel: { fontSize: FONT_SIZE.xs, ...FONTS.medium, color: COLORS.textMuted, marginTop: 2 },
  menuWrap: { paddingTop: SPACING.sm, paddingBottom: SPACING.lg },
  menuSection: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  sectionLabel: { fontSize: FONT_SIZE.xs, ...FONTS.bold, color: COLORS.textDisabled, letterSpacing: 1.2, textTransform: "uppercase", paddingVertical: SPACING.sm, paddingTop: SPACING.md },
  menuRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIconWrap: { width: 38, height: 38, borderRadius: RADIUS.sm, backgroundColor: COLORS.accentMuted, alignItems: "center", justifyContent: "center" },
  menuIconDanger: { backgroundColor: COLORS.errorBg },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.base, ...FONTS.medium, color: COLORS.textPrimary },
  menuBadge: { paddingHorizontal: 8, paddingVertical: 3, backgroundColor: COLORS.bgSection, borderRadius: RADIUS.full },
  menuBadgeGreen: { backgroundColor: COLORS.accentMuted },
  menuBadgeText: { fontSize: FONT_SIZE.xs, ...FONTS.bold, color: COLORS.accent },
  version: { textAlign: "center", fontSize: FONT_SIZE.xs, ...FONTS.regular, color: COLORS.textDisabled, paddingBottom: SPACING.xl, paddingTop: SPACING.sm },
});