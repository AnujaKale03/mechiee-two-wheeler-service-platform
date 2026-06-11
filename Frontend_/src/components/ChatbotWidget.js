import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  COLORS,
  FONTS,
  RADIUS,
  SHADOW,
  SPACING,
} from "../utils/theme";

const FAQS = [
  {
    keywords: ["service", "services"],
    response:
      "🏍️ Standard Service - ₹499\n⭐ Premium Service - ₹999\n🔧 Engine Repair - ₹1999",
  },

  {
    keywords: ["price", "pricing", "cost"],
    response:
      "Our pricing starts from ₹499 for Standard Service, ₹999 for Premium Service and ₹1999 for Engine Repair.",
  },

  {
    keywords: ["book", "booking", "appointment"],
    response:
      "To book a service, tap the Book Service button from the Home screen and choose your preferred service.",
  },

  {
    keywords: ["track", "status"],
    response:
      "You can track your booking status from the Bookings section.",
  },

  {
    keywords: ["mechanic", "technician"],
    response:
      "All Mechiee mechanics are verified professionals experienced in two-wheeler servicing.",
  },

  {
    keywords: ["oil"],
    response:
      "Engine oil should typically be changed every 2500-3000 km depending on your bike model.",
  },

  {
    keywords: ["custom", "special requirement", "special request"],
    response:
      "Yes 👍 Mechiee supports custom service requests. Describe your issue during booking and the mechanic will inspect it before confirming the final cost.",
  },

  {
    keywords: ["payment", "pay", "upi", "cash"],
    response:
      "We accept UPI, PhonePe, Google Pay, Paytm and Cash after service completion.",
  },

  {
    keywords: ["cancel"],
    response:
      "Bookings can be cancelled before mechanic assignment without any cancellation charges.",
  },

  {
    keywords: ["reschedule"],
    response:
      "You can reschedule your booking directly from the Bookings screen.",
  },

  {
    keywords: ["battery"],
    response:
      "Battery health can be checked during servicing. Replacement charges depend on the bike model.",
  },

  {
    keywords: ["tyre", "tire", "puncture"],
    response:
      "Tyre inspection is included in service checks. Puncture repair and tyre replacement are available as additional services.",
  },

  {
    keywords: ["brake"],
    response:
      "Brake inspection is included in Premium Service. Additional replacement costs may apply if parts need changing.",
  },

  {
    keywords: ["chain"],
    response:
      "Chain cleaning and lubrication are included in Premium Service.",
  },

  {
    keywords: ["insurance"],
    response:
      "Currently Mechiee focuses on servicing and repairs. Insurance assistance may be added in future updates.",
  },

  {
    keywords: ["location", "city", "available"],
    response:
      "Mechiee doorstep service is available in selected cities. Please check availability while booking.",
  },

  {
    keywords: ["emergency", "breakdown"],
    response:
      "For breakdown assistance, create a booking and choose Engine Repair if available in your area.",
  },

  {
    keywords: ["hello", "hi", "hey"],
    response:
      "Hello 👋 Welcome to Mechiee. How can I assist you today?",
  },
];

const getBotResponse = (message) => {
  const msg = message.toLowerCase();

  const match = FAQS.find((item) =>
    item.keywords.some((keyword) =>
      msg.includes(keyword.toLowerCase())
    )
  );

  return (
    match?.response ||
    "I can help with bookings, services, pricing, repairs and bike maintenance questions. 🚀"
  );
};

export default function ChatbotWidget({ role = "customer" }) {
  const [visible, setVisible] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text:
        role === "mechanic"
          ? "Hi! I'm your Mechiee Assistant 🔧 How can I help you today?"
          : "Hi! I'm Mechiee Assistant 🏍️ How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef(null);

  const sendMessage = () => {
    const text = input.trim();

    if (!text || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botMessage = {
        id: Date.now().toString() + "_bot",
        role: "assistant",
        text: getBotResponse(text),
      };

      setMessages((prev) => [...prev, botMessage]);

      setLoading(false);

      setTimeout(() => {
        listRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    }, 600);
  };

  const bubbleColor =
    role === "mechanic"
      ? COLORS.mechanicAccent
      : COLORS.primaryDark;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: bubbleColor },
        ]}
        onPress={() => setVisible(true)}
        activeOpacity={0.9}
      >
        <Text style={styles.fabIcon}>💬</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            Platform.OS === "ios" ? "padding" : undefined
          }
        >
          <View style={styles.overlay}>
            <View style={styles.sheet}>
              <View
                style={[
                  styles.chatHeader,
                  { backgroundColor: bubbleColor },
                ]}
              >
                <View>
                  <Text style={styles.chatTitle}>
                    Mechiee Assistant
                  </Text>
                  <Text style={styles.chatSub}>
                    Always here to help
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setVisible(false)}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.bubble,
                      item.role === "user"
                        ? [
                            styles.userBubble,
                            {
                              backgroundColor:
                                bubbleColor,
                            },
                          ]
                        : styles.aiBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        item.role === "user"
                          ? styles.userText
                          : styles.aiText,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>
                )}
              />

              {loading && (
                <View style={styles.typing}>
                  <ActivityIndicator
                    color={bubbleColor}
                    size="small"
                  />
                  <Text style={styles.typingText}>
                    Assistant is typing...
                  </Text>
                </View>
              )}

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Ask anything about Mechiee..."
                  placeholderTextColor={
                    COLORS.textMuted
                  }
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={sendMessage}
                  returnKeyType="send"
                />

                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    {
                      backgroundColor: bubbleColor,
                    },
                  ]}
                  onPress={sendMessage}
                >
                  <Text style={styles.sendIcon}>↑</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    ...SHADOW.lg,
  },

  fabIcon: {
    fontSize: 22,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: COLORS.overlay,
  },

  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },

  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  chatTitle: {
    color: "#fff",
    fontSize: 16,
    ...FONTS.bold,
  },

  chatSub: {
    color: "#fff",
    fontSize: 11,
  },

  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    color: "#fff",
    fontWeight: "700",
  },

  messageList: {
    padding: SPACING.md,
  },

  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },

  userBubble: {
    alignSelf: "flex-end",
  },

  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  bubbleText: {
    fontSize: 14,
  },

  userText: {
    color: "#fff",
  },

  aiText: {
    color: COLORS.textPrimary,
  },

  typing: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  typingText: {
    marginLeft: 8,
    color: COLORS.textMuted,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.textPrimary,
  },

  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  sendIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});