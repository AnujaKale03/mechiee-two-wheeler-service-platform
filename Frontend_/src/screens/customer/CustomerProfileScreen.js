// src/screens/customer/CustomerProfileScreen.js
// Customer profile with 3-dot menu + photo from device library

import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  Image, Alert, ActionSheetIOS, Platform, Modal, ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS, FONT_SIZE, RADIUS, SHADOW, SPACING, STATUS_META } from "../../utils/theme";
import { getBookings } from "../../services/bookingService";

const MENU_ITEMS = [
  { key: "change_photo", label: "Change profile photo" },
  { key: "remove_photo", label: "Remove photo"         },
  { key: "logout",       label: "Sign out", danger: true },
];

export default function CustomerProfileScreen({ navigation }) {
  const [photo,       setPhoto]       = useState(null);
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [customerName, setCustomerName] = useState("Customer");

  useEffect(() => {
    loadProfile();
    fetchBookings();
  }, []);

  const loadProfile = async () => {
    const name  = await AsyncStorage.getItem("customerName");
    const photo = await AsyncStorage.getItem("customerPhoto");
    if (name)  setCustomerName(name);
    if (photo) setPhoto(photo);
  };

  const fetchBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo library access to change your profile photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      await AsyncStorage.setItem("customerPhoto", uri);
    }
    setMenuVisible(false);
  };

  const handleMenuAction = async (key) => {
    setMenuVisible(false);
    if (key === "change_photo") { await pickImage(); return; }
    if (key === "remove_photo") {
      setPhoto(null);
      await AsyncStorage.removeItem("customerPhoto");
      return;
    }
    if (key === "logout") {
      Alert.alert("Sign out", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out", style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove(["authToken", "authRole", "customerName", "customerPhoto"]);
            navigation.replace("RoleSelection");
          },
        },
      ]);
    }
  };

  const openMenu = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", ...MENU_ITEMS.map((m) => m.label)],
          destructiveButtonIndex: MENU_ITEMS.findIndex((m) => m.danger) + 1,
          cancelButtonIndex: 0,
        },
        (idx) => { if (idx > 0) handleMenuAction(MENU_ITEMS[idx - 1].key); }
      );
    } else {
      setMenuVisible(true);
    }
  };

  const completed  = bookings.filter((b) => b.status === "COMPLETED").length;
  const inProgress = bookings.filter((b) => b.status === "IN_PROGRESS").length;

  const initials = (name = "") =>
    name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "C";

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={openMenu}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.85}>
            {photo
              ? <Image source={{ uri: photo }} style={styles.avatar} />
              : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>{initials(customerName)}</Text>
                </View>
              )
            }
            <View style={styles.cameraChip}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{customerName}</Text>
          <Text style={styles.role}>Customer</Text>
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {[
            { num: bookings.length, label: "Total Bookings" },
            { num: completed,       label: "Completed"      },
            { num: inProgress,      label: "In Progress"    },
          ].map(({ num, label }) => (
            <View key={label} style={styles.statBox}>
              <Text style={styles.statNum}>{num}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Recent bookings */}
        <Text style={styles.sectionLabel}>RECENT BOOKINGS</Text>
        {loading
          ? <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING.md }} />
          : bookings.length === 0
            ? <Text style={styles.emptyText}>No bookings yet.</Text>
            : bookings.slice(0, 5).map((b) => {
                const meta = STATUS_META[b.status] || STATUS_META.CANCELLED;
                return (
                  <View key={b._id} style={styles.bookingRow}>
                    <View style={styles.bookingLeft}>
                      <Text style={styles.bookingService}>{b.serviceId?.name ?? "Service"}</Text>
                      <Text style={styles.bookingBike}>{b.bikeModel} · {b.vehicleNumber}</Text>
                    </View>
                    <View style={[styles.statusChip, { backgroundColor: meta.bg }]}>
                      <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                    </View>
                  </View>
                );
              })
        }

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => handleMenuAction("logout")}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Android dropdown */}
      {Platform.OS === "android" && (
        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
            <View style={styles.menuSheet}>
              {MENU_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.menuItem}
                  onPress={() => handleMenuAction(item.key)}
                >
                  <Text style={[styles.menuItemText, item.danger && styles.menuItemDanger]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  safeHeader: {
    backgroundColor: COLORS.primary,
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: SPACING.screen,
    paddingTop: SPACING.md, paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  backArrow: { fontSize: 24, color: COLORS.textInverse, lineHeight: 28, ...FONTS.bold },
  headerTitle: { flex: 1, fontSize: FONT_SIZE.lg, ...FONTS.bold, color: COLORS.textInverse, marginLeft: SPACING.md },
  menuBtn: {
    width: 36, height: 36, borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  menuDots: { fontSize: 22, color: COLORS.textInverse, ...FONTS.bold },

  body: { paddingBottom: SPACING.xxl },

  avatarSection: { alignItems: "center", paddingTop: SPACING.xl, paddingBottom: SPACING.lg },
  avatar: { width: 100, height: 100, borderRadius: RADIUS.full, ...SHADOW.md },
  avatarFallback: {
    width: 100, height: 100, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: COLORS.surface, ...SHADOW.md,
  },
  avatarInitial: { fontSize: 40, ...FONTS.bold, color: COLORS.primary },
  cameraChip: {
    position: "absolute", bottom: 0, right: 0,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    width: 30, height: 30, alignItems: "center", justifyContent: "center",
    ...SHADOW.sm,
  },
  cameraIcon: { fontSize: 14 },
  name: { fontSize: FONT_SIZE.xl, ...FONTS.bold, color: COLORS.textPrimary, marginTop: SPACING.sm },
  role: { fontSize: FONT_SIZE.sm, ...FONTS.regular, color: COLORS.textMuted, marginTop: 4 },

  statsRow: {
    flexDirection: "row", gap: SPACING.sm,
    marginHorizontal: SPACING.screen, marginBottom: SPACING.lg,
  },
  statBox: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: SPACING.md,
    alignItems: "center", ...SHADOW.xs,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statNum:   { fontSize: FONT_SIZE.xl, ...FONTS.extraBold, color: COLORS.primary },
  statLabel: { fontSize: FONT_SIZE.xs, ...FONTS.medium, color: COLORS.textMuted, marginTop: 2, textAlign: "center" },

  sectionLabel: {
    fontSize: FONT_SIZE.xs, ...FONTS.semiBold, color: COLORS.textMuted,
    letterSpacing: 1, textTransform: "uppercase",
    marginHorizontal: SPACING.screen, marginBottom: SPACING.sm,
  },
  bookingRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.screen, marginBottom: SPACING.sm,
    borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.xs,
  },
  bookingLeft:    { flex: 1 },
  bookingService: { fontSize: FONT_SIZE.base, ...FONTS.semiBold, color: COLORS.textPrimary },
  bookingBike:    { fontSize: FONT_SIZE.sm, ...FONTS.regular, color: COLORS.textMuted, marginTop: 2 },
  statusChip:     { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full },
  statusText:     { fontSize: FONT_SIZE.xs, ...FONTS.semiBold },
  emptyText:      { fontSize: FONT_SIZE.base, ...FONTS.medium, color: COLORS.textMuted, textAlign: "center", marginTop: SPACING.md },

  logoutBtn: {
    marginHorizontal: SPACING.screen, marginTop: SPACING.lg,
    backgroundColor: COLORS.errorBg, paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg, alignItems: "center",
    borderWidth: 1, borderColor: COLORS.errorBorder,
  },
  logoutText: { fontSize: FONT_SIZE.base, ...FONTS.bold, color: COLORS.error },

  modalOverlay: {
    flex: 1, backgroundColor: COLORS.overlay,
    justifyContent: "flex-start", alignItems: "flex-end",
    paddingTop: 64, paddingRight: SPACING.screen,
  },
  menuSheet: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    minWidth: 210, ...SHADOW.lg, overflow: "hidden",
    borderWidth: 1, borderColor: COLORS.border,
  },
  menuItem: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  menuItemText:   { fontSize: FONT_SIZE.base, ...FONTS.medium, color: COLORS.textPrimary },
  menuItemDanger: { color: COLORS.error },
});