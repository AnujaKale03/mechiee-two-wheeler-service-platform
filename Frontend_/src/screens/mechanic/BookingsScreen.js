import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native";
import { getMyBookings, updateBookingStatus, updateETA } from "../../services/bookingService";
import MechanicBookingCard from "../../components/MechanicBookingCard";
import Toast from "react-native-toast-message";
import { COLORS, FONTS, RADIUS, SPACING } from "../../utils/theme";

const FILTERS = ["All", "ASSIGNED", "IN_PROGRESS", "COMPLETED"];

export default function MechanicBookingsScreen() {
  const [bookings, setBookings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [etaModal, setEtaModal]         = useState(null);
  const [etaInput, setEtaInput]         = useState("");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await getMyBookings();
      setBookings(res.data);
    } catch { Toast.show({ type: "error", text1: "Failed to load bookings" }); }
    finally { if (showLoader) setLoading(false); }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      await fetchBookings(false);
      Toast.show({ type: "success", text1: "Status Updated", text2: `Marked as ${status.replace("_", " ")}` });
    } catch { Toast.show({ type: "error", text1: "Update Failed" }); }
  };

  const handleETASubmit = async () => {
    if (!etaInput.trim()) return;
    try {
      await updateETA(etaModal, etaInput.trim());
      setEtaModal(null); setEtaInput("");
      await fetchBookings(false);
      Toast.show({ type: "success", text1: "ETA Updated" });
    } catch { Toast.show({ type: "error", text1: "Failed to update ETA" }); }
  };

  const filtered = activeFilter === "All" ? bookings : bookings.filter((b) => b.status === activeFilter);

  if (loading) return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={COLORS.mechanicAccent} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Assignments</Text>
        <Text style={styles.subtitle}>{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</Text>
      </View>

      {/* Filter chips — horizontal ScrollView instead of FlatList */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, activeFilter === item && styles.chipActive]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[styles.chipText, activeFilter === item && styles.chipTextActive]}>
                {item === "All" ? "All" : item.replace("_", " ")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bookings list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={async () => { setRefreshing(true); await fetchBookings(false); setRefreshing(false); }}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MechanicBookingCard
            booking={item}
            onUpdateStatus={handleStatusUpdate}
            onSetETA={() => { setEtaModal(item._id); setEtaInput(item.eta || ""); }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Assignments</Text>
            <Text style={styles.emptyDesc}>
              {activeFilter === "All" ? "No bookings assigned yet." : `No ${activeFilter.replace("_", " ")} bookings.`}
            </Text>
          </View>
        }
      />

      {/* ETA Modal */}
      <Modal visible={!!etaModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set ETA</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 30 mins, 1 hour"
              placeholderTextColor={COLORS.textMuted}
              value={etaInput}
              onChangeText={setEtaInput}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setEtaModal(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={handleETASubmit}>
                <Text style={styles.modalSubmitText}>Set ETA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.bg },
  loader:      { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: COLORS.mechanicAccentPastel,
    paddingHorizontal: SPACING.lg,
    paddingTop: 52,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title:    { fontSize: 28, ...FONTS.extraBold, color: COLORS.textOnMechanic },
  subtitle: { fontSize: 14, ...FONTS.regular, color: COLORS.textOnMechanicMuted, marginTop: 4 },

  // ── Filter chips ──────────────────────────────────────
  filterWrapper: {
    height: 52,                  // fixed height so it never stretches tall
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    alignItems: "center",        // vertically center chips in the row
    flexDirection: "row",
  },
  chip: {
    height: 34,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive:     { backgroundColor: COLORS.mechanicAccent, borderColor: COLORS.mechanicAccent },
  chipText:       { fontSize: 13, ...FONTS.semiBold, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.textInverse },

  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl, paddingTop: SPACING.sm },

  emptyBox:  { alignItems: "center", paddingTop: SPACING.xxl },
  emptyIcon: { fontSize: 52, marginBottom: SPACING.md },
  emptyTitle:{ fontSize: 18, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.sm },
  emptyDesc: { fontSize: 14, ...FONTS.regular, color: COLORS.textSecondary, textAlign: "center" },

  modalOverlay:     { flex: 1, backgroundColor: COLORS.overlay, justifyContent: "center", alignItems: "center", padding: SPACING.lg },
  modalCard:        { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg, width: "100%" },
  modalTitle:       { fontSize: 18, ...FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.md },
  modalInput:       { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 15, ...FONTS.medium, color: COLORS.textPrimary, backgroundColor: COLORS.bg, marginBottom: SPACING.md },
  modalBtns:        { flexDirection: "row", gap: SPACING.sm },
  modalCancel:      { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, alignItems: "center", backgroundColor: COLORS.surfaceAlt },
  modalCancelText:  { fontSize: 14, ...FONTS.semiBold, color: COLORS.textSecondary },
  modalSubmit:      { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, alignItems: "center", backgroundColor: COLORS.mechanicAccent },
  modalSubmitText:  { fontSize: 14, ...FONTS.bold, color: COLORS.textInverse },
});