// src/screens/admin/AdminProfileScreen.js
// Admin profile with 3-dot menu + photo from device library

import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  Image, Alert, ActionSheetIOS, Platform, Modal,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS, FONT_SIZE, RADIUS, SHADOW, SPACING } from "../../utils/theme";

const MENU_ITEMS = [
  { key: "change_photo", label: "Change profile photo" },
  { key: "remove_photo", label: "Remove photo"         },
  { key: "logout",       label: "Sign out",  danger: true },
];

export default function AdminProfileScreen({ navigation }) {
  const [photo, setPhoto] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // ── Photo picker ──────────────────────────────────────────────────────────
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow access to your photo library to change your profile photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhoto(result.assets[0].uri);
    }
    setMenuVisible(false);
  };

  // ── 3-dot menu action ─────────────────────────────────────────────────────
  const handleMenuAction = async (key) => {
    setMenuVisible(false);
    if (key === "change_photo") { await pickImage(); return; }
    if (key === "remove_photo") { setPhoto(null);    return; }
    if (key === "logout") {
      Alert.alert("Sign out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out", style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove(["authToken", "authRole"]);
            navigation.replace("RoleSelection");
          },
        },
      ]);
    }
  };

  // On iOS use native action sheet; on Android use our modal
  const openMenu = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options:       ["Cancel", ...MENU_ITEMS.map((m) => m.label)],
          destructiveButtonIndex: MENU_ITEMS.findIndex((m) => m.danger) + 1,
          cancelButtonIndex: 0,
        },
        (idx) => { if (idx > 0) handleMenuAction(MENU_ITEMS[idx - 1].key); }
      );
    } else {
      setMenuVisible(true);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        {/* 3-dot menu button */}
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
                  <Text style={styles.avatarInitial}>A</Text>
                </View>
              )
            }
            <View style={styles.cameraChip}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>Admin</Text>
          <Text style={styles.role}>Platform Administrator</Text>
        </View>

        {/* Info rows */}
        <View style={styles.card}>
          {[
            { label: "Role",     value: "Administrator" },
            { label: "Access",   value: "Full platform access" },
            { label: "Portal",   value: "Admin v1.0" },
          ].map(({ label, value }) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => handleMenuAction("logout")}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Android dropdown menu modal */}
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
    backgroundColor: COLORS.adminAccent,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.screen,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  backArrow: { fontSize: 24, color: COLORS.textInverse, lineHeight: 28, ...FONTS.bold },
  headerTitle: { flex: 1, fontSize: FONT_SIZE.lg, ...FONTS.bold, color: COLORS.textInverse, marginLeft: SPACING.md },
  menuBtn: {
    width: 36, height: 36, borderRadius: RADIUS.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  menuDots: { fontSize: 22, color: COLORS.textInverse, ...FONTS.bold },

  body: { paddingBottom: SPACING.xxl },

  avatarSection: { alignItems: "center", paddingTop: SPACING.xl, paddingBottom: SPACING.xl },
  avatar: { width: 100, height: 100, borderRadius: RADIUS.full, ...SHADOW.md },
  avatarFallback: {
    width: 100, height: 100, borderRadius: RADIUS.full,
    backgroundColor: COLORS.adminAccentLight,
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: COLORS.surface, ...SHADOW.md,
  },
  avatarInitial: { fontSize: 40, ...FONTS.bold, color: COLORS.adminAccent },
  cameraChip: {
    position: "absolute", bottom: 0, right: 0,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    width: 30, height: 30, alignItems: "center", justifyContent: "center",
    ...SHADOW.sm,
  },
  cameraIcon: { fontSize: 14 },
  name:  { fontSize: FONT_SIZE.xl, ...FONTS.bold, color: COLORS.textPrimary, marginTop: SPACING.sm },
  role:  { fontSize: FONT_SIZE.sm, ...FONTS.regular, color: COLORS.textMuted, marginTop: 4 },

  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.screen,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: "hidden", ...SHADOW.sm,
  },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  infoLabel: { fontSize: FONT_SIZE.sm, ...FONTS.medium, color: COLORS.textMuted },
  infoValue: { fontSize: FONT_SIZE.sm, ...FONTS.semiBold, color: COLORS.textPrimary },

  logoutBtn: {
    marginHorizontal: SPACING.screen, marginTop: SPACING.lg,
    backgroundColor: COLORS.errorBg, paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg, alignItems: "center",
    borderWidth: 1, borderColor: COLORS.errorBorder,
  },
  logoutText: { fontSize: FONT_SIZE.base, ...FONTS.bold, color: COLORS.error },

  // Android menu modal
  modalOverlay: {
    flex: 1, backgroundColor: COLORS.overlay, justifyContent: "flex-start", alignItems: "flex-end",
    paddingTop: 64, paddingRight: SPACING.screen,
  },
  menuSheet: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    minWidth: 200, ...SHADOW.lg, overflow: "hidden",
    borderWidth: 1, borderColor: COLORS.border,
  },
  menuItem: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  menuItemText: { fontSize: FONT_SIZE.base, ...FONTS.medium, color: COLORS.textPrimary },
  menuItemDanger: { color: COLORS.error },
});