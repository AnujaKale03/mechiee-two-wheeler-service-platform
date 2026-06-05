// src/utils/theme.js
// Mechiee brand design tokens — import this everywhere

export const COLORS = {
  // Brand
  primary: "#FF6B00",        // Mechiee orange
  primaryDark: "#CC5500",
  primaryLight: "#FF8C38",
  primaryFaint: "#FFF0E6",

  // Neutrals
  bg: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F2F5",
  border: "#E8EAF0",

  // Text
  textPrimary: "#1A1D23",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  textInverse: "#FFFFFF",

  // Status
  success: "#16A34A",
  successBg: "#DCFCE7",
  warning: "#D97706",
  warningBg: "#FEF3C7",
  error: "#DC2626",
  errorBg: "#FEE2E2",
  info: "#2563EB",
  infoBg: "#DBEAFE",

  // Mechanic flow accent
  mechanicAccent: "#1E3A5F",
  mechanicAccentLight: "#E8EEF6",
};

export const FONTS = {
  regular: { fontFamily: "System", fontWeight: "400" },
  medium: { fontFamily: "System", fontWeight: "500" },
  semiBold: { fontFamily: "System", fontWeight: "600" },
  bold: { fontFamily: "System", fontWeight: "700" },
  extraBold: { fontFamily: "System", fontWeight: "800" },
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SHADOW = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const STATUS_META = {
  ASSIGNED: {
    label: "Assigned",
    color: COLORS.info,
    bg: COLORS.infoBg,
    icon: "🔧",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: COLORS.warning,
    bg: COLORS.warningBg,
    icon: "⚙️",
  },
  COMPLETED: {
    label: "Completed",
    color: COLORS.success,
    bg: COLORS.successBg,
    icon: "✅",
  },
  WAITLISTED: {
    label: "Waitlisted",
    color: COLORS.error,
    bg: COLORS.errorBg,
    icon: "⏳",
  },
};