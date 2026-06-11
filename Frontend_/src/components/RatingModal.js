import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { rateBooking } from "../services/bookingService";
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from "../utils/theme";

export default function RatingModal({ visible, bookingId, onClose, onSubmitted }) {
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    if (rating < 1) { setError("Please select a rating"); return; }
    setLoading(true); setError("");
    try {
      await rateBooking(bookingId, rating, comment);
      onSubmitted?.();
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to submit rating.");
    } finally { setLoading(false); }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Rate Your Service</Text>
          <Text style={styles.subtitle}>How was your experience?</Text>

          {/* Stars */}
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Text style={[styles.star, s <= rating && styles.starActive]}>{s <= rating ? "★" : "☆"}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Add a comment (optional)"
            placeholderTextColor={COLORS.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.55 }]} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color={COLORS.textInverse} /> : <Text style={styles.submitText}>Submit</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: "center", alignItems: "center", padding: SPACING.lg },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.lg, width: "100%", ...SHADOW.lg },
  title: { fontSize: 20, ...FONTS.extraBold, color: COLORS.textPrimary, textAlign: "center" },
  subtitle: { fontSize: 13, ...FONTS.regular, color: COLORS.textSecondary, textAlign: "center", marginTop: 4, marginBottom: SPACING.md },
  starsRow: { flexDirection: "row", justifyContent: "center", gap: SPACING.sm, marginBottom: SPACING.md },
  star: { fontSize: 40, color: COLORS.border },
  starActive: { color: COLORS.warning },
  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 14, ...FONTS.regular, color: COLORS.textPrimary, backgroundColor: COLORS.bg, minHeight: 80, textAlignVertical: "top", marginBottom: SPACING.sm },
  error: { fontSize: 13, ...FONTS.medium, color: COLORS.error, marginBottom: SPACING.sm },
  btnRow: { flexDirection: "row", gap: SPACING.sm },
  cancelBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, alignItems: "center", backgroundColor: COLORS.surfaceAlt },
  cancelText: { fontSize: 15, ...FONTS.semiBold, color: COLORS.textSecondary },
  submitBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, alignItems: "center", backgroundColor: COLORS.primaryDark },
  submitText: { fontSize: 15, ...FONTS.bold, color: COLORS.textInverse },
});