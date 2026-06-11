// src/utils/theme.js — Mechiee Pro Dark Theme
// Inspired by MechanicGo: dark backgrounds, vivid green accent, clean white text

export const COLORS = {

  // ─── Brand Accent ───────────────────────────────────────────────────────────
  accent:             "#00E676",   // vivid green — primary CTA, active states (like MechanicGo)
  accentDark:         "#00C853",   // pressed / darker green
  accentBg:           "#003B1F",   // very dark green bg for accent containers
  accentMuted:        "rgba(0,230,118,0.15)", // subtle green tint for badges/pills

  // ─── App Backgrounds ────────────────────────────────────────────────────────
  bg:                 "#0D0D0D",   // near-black app background
  bgCard:             "#1A1A1A",   // card / surface background
  bgElevated:         "#222222",   // elevated card (modals, drawers)
  bgInput:            "#1E1E1E",   // input fields
  bgSection:          "#141414",   // section separators

  // ─── Surface / Cards ────────────────────────────────────────────────────────
  surface:            "#1A1A1A",
  surfaceAlt:         "#222222",
  surfaceRaised:      "#242424",

  // ─── Borders ────────────────────────────────────────────────────────────────
  border:             "#2A2A2A",
  borderLight:        "#333333",
  borderStrong:       "#404040",
  borderAccent:       "#00E676",   // green border for active/selected

  // ─── Customer Flow ──────────────────────────────────────────────────────────
  primary:            "#00E676",
  primaryDark:        "#00C853",
  primaryMid:         "#69F0AE",
  primaryLight:       "#003B1F",
  primaryFaint:       "rgba(0,230,118,0.08)",

  // ─── Mechanic Flow ──────────────────────────────────────────────────────────
  mechanicAccent:         "#00BCD4",   // cyan — distinct from customer green
  mechanicAccentMid:      "#26C6DA",
  mechanicAccentPastel:   "rgba(0,188,212,0.15)",
  mechanicAccentLight:    "rgba(0,188,212,0.08)",

  // ─── Admin Flow ─────────────────────────────────────────────────────────────
  adminAccent:            "#E94560",   // vivid red-pink (like Ola ops red)
  adminAccentMid:         "#FF6B81",
  adminAccentLight:       "rgba(233,69,96,0.12)",
  adminAccentPastel:      "rgba(233,69,96,0.08)",

  // ─── Text ───────────────────────────────────────────────────────────────────
  textPrimary:        "#FFFFFF",
  textSecondary:      "#B0B0B0",
  textMuted:          "#707070",
  textDisabled:       "#4A4A4A",
  textInverse:        "#0D0D0D",   // dark text on light/green bg
  textInverseMuted:   "rgba(13,13,13,0.65)",
  textOnAccent:       "#0D0D0D",   // text sitting on green accent
  textLink:           "#00E676",

  // ─── On-surface text helpers (used in headers) ──────────────────────────────
  textOnPrimary:      "#0D0D0D",
  textOnPrimaryMuted: "rgba(13,13,13,0.6)",
  textOnMechanic:     "#0D0D0D",
  textOnMechanicMuted:"rgba(13,13,13,0.6)",

  // ─── Status ─────────────────────────────────────────────────────────────────
  success:        "#00E676",
  successBg:      "rgba(0,230,118,0.12)",
  successBorder:  "rgba(0,230,118,0.3)",
  successText:    "#00E676",

  warning:        "#FFB300",
  warningBg:      "rgba(255,179,0,0.12)",
  warningBorder:  "rgba(255,179,0,0.3)",
  warningText:    "#FFB300",

  error:          "#FF5252",
  errorBg:        "rgba(255,82,82,0.12)",
  errorBorder:    "rgba(255,82,82,0.3)",
  errorText:      "#FF5252",

  info:           "#448AFF",
  infoBg:         "rgba(68,138,255,0.12)",
  infoBorder:     "rgba(68,138,255,0.3)",
  infoText:       "#448AFF",

  // ─── Misc ───────────────────────────────────────────────────────────────────
  overlay:          "rgba(0,0,0,0.75)",
  overlayLight:     "rgba(0,0,0,0.45)",
  divider:          "#1E1E1E",
  star:             "#FFB300",

  // ─── Admin stat card palette — monochromatic dark ───────────────────────────
  // Used in admin dashboard — no rainbow, all dark cards with colored accents
};

// ─── Typography ──────────────────────────────────────────────────────────────
export const FONTS = {
  regular:   { fontFamily: "System", fontWeight: "400" },
  medium:    { fontFamily: "System", fontWeight: "500" },
  semiBold:  { fontFamily: "System", fontWeight: "600" },
  bold:      { fontFamily: "System", fontWeight: "700" },
  extraBold: { fontFamily: "System", fontWeight: "800" },
};

export const FONT_SIZE = {
  xs:   11,
  sm:   13,
  base: 15,
  md:   16,
  lg:   18,
  xl:   20,
  xxl:  24,
  xxxl: 28,
  hero: 32,
};

// ─── Border Radius ───────────────────────────────────────────────────────────
export const RADIUS = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  28,
  full: 999,
};

// ─── Shadows ─────────────────────────────────────────────────────────────────
// Dark theme: shadows are subtle — most depth comes from bg color contrast
export const SHADOW = {
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  accent: {
    shadowColor: "#00E676",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const SPACING = {
  xxs: 2,
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
  screen: 20,
};

// ─── Status Meta ─────────────────────────────────────────────────────────────
export const STATUS_META = {
  ASSIGNED: {
    label: "Assigned",
    color: "#448AFF",
    bg:    "rgba(68,138,255,0.15)",
    border:"rgba(68,138,255,0.3)",
    icon:  "🔧",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#FFB300",
    bg:    "rgba(255,179,0,0.15)",
    border:"rgba(255,179,0,0.3)",
    icon:  "⚙️",
  },
  COMPLETED: {
    label: "Completed",
    color: "#00E676",
    bg:    "rgba(0,230,118,0.15)",
    border:"rgba(0,230,118,0.3)",
    icon:  "✅",
  },
  WAITLISTED: {
    label: "Waitlisted",
    color: "#707070",
    bg:    "rgba(112,112,112,0.15)",
    border:"rgba(112,112,112,0.3)",
    icon:  "⏳",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#FF5252",
    bg:    "rgba(255,82,82,0.15)",
    border:"rgba(255,82,82,0.3)",
    icon:  "✕",
  },
};

// ─── Admin Dashboard Stat Cards ──────────────────────────────────────────────
// Dark cards, accent color only on the number — no rainbow backgrounds
export const ADMIN_STAT_COLORS = {
  total:      { accent: "#00E676" },
  today:      { accent: "#448AFF" },
  completed:  { accent: "#00E676" },
  inProgress: { accent: "#FFB300" },
  waitlisted: { accent: "#FF5252" },
  cancelled:  { accent: "#707070" },
  revenue:    { accent: "#00BCD4" },
};