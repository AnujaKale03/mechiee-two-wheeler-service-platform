// src/utils/theme.js
// Mechiee brand design tokens — import this everywhere

export const COLORS = {
  // Brand — Mechiee signature orange
  primary: "#F05A28",
  primaryDark: "#C4441A",
  primaryLight: "#F47B52",
  primaryFaint: "#FEF0EB",
  primaryGradientStart: "#F05A28",
  primaryGradientEnd: "#C4441A",

  // Mechanic portal — deep professional navy
  mechanicAccent: "#152E4D",
  mechanicAccentMid: "#1E4470",
  mechanicAccentLight: "#EAF0F8",
  mechanicGradientStart: "#152E4D",
  mechanicGradientEnd: "#1E4470",

  // Neutrals — clean, minimal, professional
  bg: "#F4F6F9",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  surfaceAlt: "#EEF1F6",
  border: "#E2E7EF",
  borderLight: "#F0F3F8",

  // Text hierarchy
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textMuted: "#9CA3AF",
  textInverse: "#FFFFFF",
  textInverseMuted: "rgba(255,255,255,0.72)",

  // Semantic status
  success: "#059669",
  successBg: "#D1FAE5",
  successBorder: "#A7F3D0",
  warning: "#D97706",
  warningBg: "#FEF3C7",
  warningBorder: "#FDE68A",
  error: "#DC2626",
  errorBg: "#FEE2E2",
  errorBorder: "#FECACA",
  info: "#1D4ED8",
  infoBg: "#DBEAFE",
  infoBorder: "#BFDBFE",

  // Overlay
  overlay: "rgba(17,24,39,0.45)",
  shimmer: "#E9ECF1",
};

export const FONTS = {
  regular:   { fontFamily: "System", fontWeight: "400" },
  medium:    { fontFamily: "System", fontWeight: "500" },
  semiBold:  { fontFamily: "System", fontWeight: "600" },
  bold:      { fontFamily: "System", fontWeight: "700" },
  extraBold: { fontFamily: "System", fontWeight: "800" },
};

export const RADIUS = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
  full: 999,
};

export const SHADOW = {
  xs: {
    shadowColor: "#1E2D40",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#1E2D40",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: "#1E2D40",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "#1E2D40",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const STATUS_META = {
  ASSIGNED: {
    label: "Assigned",
    color: COLORS.info,
    bg: COLORS.infoBg,
    border: COLORS.infoBorder,
    icon: "🔧",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: COLORS.warning,
    bg: COLORS.warningBg,
    border: COLORS.warningBorder,
    icon: "⚙️",
  },
  COMPLETED: {
    label: "Completed",
    color: COLORS.success,
    bg: COLORS.successBg,
    border: COLORS.successBorder,
    icon: "✅",
  },
  WAITLISTED: {
    label: "Waitlisted",
    color: COLORS.error,
    bg: COLORS.errorBg,
    border: COLORS.errorBorder,
    icon: "⏳",
  },
};