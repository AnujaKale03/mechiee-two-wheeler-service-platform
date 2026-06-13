# Mechiee — Architecture

This document describes the system architecture, data flow, navigation structure, and design decisions for the Mechiee platform.

---

## Table of Contents

- [System Overview](#system-overview)
- [Navigation Architecture](#navigation-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Models](#data-models)
- [Key Services](#key-services)
- [Booking State Machine](#booking-state-machine)
- [Authentication Flow](#authentication-flow)
- [Mechanic Assignment Logic](#mechanic-assignment-logic)
- [Notification Architecture](#notification-architecture)
- [Payment Architecture](#payment-architecture)
- [Design System](#design-system)

---

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                   React Native (Expo)                    │
│                                                         │
│  ┌──────────┐   ┌──────────────┐   ┌─────────────────┐ │
│  │ Customer │   │   Mechanic   │   │      Admin      │ │
│  │   App    │   │     App      │   │      App        │ │
│  └────┬─────┘   └──────┬───────┘   └────────┬────────┘ │
│       │                │                    │           │
│       └────────────────┼────────────────────┘           │
│                        │  Axios (REST)                   │
└────────────────────────┼────────────────────────────────┘
                         │
            ┌────────────▼────────────┐
            │   Express.js API        │
            │   Node.js + MongoDB     │
            │                         │
            │  ┌─────────────────┐   │
            │  │   Controllers   │   │
            │  │  booking        │   │
            │  │  mechanic       │   │
            │  │  admin          │   │
            │  │  auth           │   │
            │  │  service        │   │
            │  └────────┬────────┘   │
            │           │            │
            │  ┌────────▼────────┐   │
            │  │    Services     │   │
            │  │  assignment     │   │
            │  │  notification   │   │
            │  │  payment        │   │
            │  └────────┬────────┘   │
            │           │            │
            │  ┌────────▼────────┐   │
            │  │  MongoDB Atlas  │   │
            │  │  Booking        │   │
            │  │  Mechanic       │   │
            │  │  Service        │   │
            │  │  User           │   │
            │  │  Notification   │   │
            │  └─────────────────┘   │
            └─────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
    ┌─────▼────┐  ┌──────▼─────┐  ┌───▼──────┐
    │  Twilio  │  │  Razorpay  │  │  Expo    │
    │  OTP     │  │  Payments  │  │  Push    │
    └──────────┘  └────────────┘  └──────────┘
```

---

## Navigation Architecture

The app uses a **Root Stack → Role-specific Tab Navigator** pattern. After login, users are pushed into their role's tab navigator which lives as a single stack screen.

```
AppNavigator (NativeStack)
│
├── Welcome
├── RoleSelection
│
├── Auth Flow
│   ├── PhoneEntry
│   ├── OtpVerify
│   └── AuthSuccess
│
├── Login Screens
│   ├── CustomerLoginScreen
│   ├── MechanicLoginScreen
│   └── AdminLoginScreen
│
├── Customer  ──► CustomerNavigator (BottomTabs)
│                  ├── Home
│                  ├── Book Service
│                  └── Bookings
│
├── MechanicApp  ──► MechanicNavigator (BottomTabs)
│                      ├── Profile
│                      └── My Jobs
│
└── AdminApp  ──► AdminNavigator (BottomTabs)
                    ├── Dashboard  ──► jumpTo("Customers")
                    │               ──► jumpTo("Mechanics")
                    │               ──► jumpTo("Waitlisted")
                    ├── Customers
                    ├── Mechanics
                    └── Waitlisted
```

> **Important:** Navigation between sibling tabs uses `navigation.jumpTo()`, not `navigation.navigate()`. The Dashboard Quick Actions use `jumpTo` to switch to the Customers, Mechanics, and Waitlisted tabs directly.

---

## Backend Architecture

### Layer responsibilities

```
routes/          → HTTP method + path definitions, middleware attachment
controllers/     → Request parsing, business logic orchestration, response shaping
services/        → Stateless utilities: payment, assignment, notifications
models/          → Mongoose schemas + validation
```

### Route map

```
POST   /auth/send-otp
POST   /auth/verify-otp
GET    /auth/me                          (JWT required)

GET    /services

POST   /bookings                         → createBooking
GET    /bookings                         → getBookings  (?customerName=)
PATCH  /bookings/:id/status              → updateBookingStatus
PATCH  /bookings/:id/cancel              → cancelBooking
PATCH  /bookings/:id/eta                 → updateETA
POST   /bookings/:id/rate                → rateBooking
POST   /bookings/:id/payment/verify      → verifyBookingPayment

POST   /mechanics/login
GET    /mechanics
GET    /mechanics/:id/profile            (mechanic JWT required)
GET    /mechanics/:id/bookings           (mechanic JWT required)
PATCH  /mechanics/:id/push-token         (mechanic JWT required)

POST   /admin/login
GET    /admin/analytics                  (admin JWT required)
GET    /admin/customers                  (admin JWT required)
GET    /admin/waitlisted                 (admin JWT required)
```

---

## Data Models

### Booking

```
customerName          String   required
bikeModel             String   required
vehicleNumber         String   required
serviceId             ObjectId → Service
mechanicId            ObjectId → Mechanic  (null if WAITLISTED)
status                Enum: ASSIGNED | WAITLISTED | IN_PROGRESS | COMPLETED | CANCELLED
paymentStatus         Enum: PENDING | AWAITING | PAID | FAILED
paymentOrderId        String   (Razorpay order ID)
paymentId             String   (Razorpay payment ID after verification)
rating                Number   1–5
ratingComment         String
eta                   String
customerExpoPushToken String
completedAt           Date
cancelledAt           Date
timestamps            createdAt, updatedAt
```

### Mechanic

```
name            String   required
pin             String   required  (4-digit, stored plain — hash in production)
phone           String
expoPushToken   String
avgRating       Number   default 0
totalRatings    Number   default 0
isActive        Boolean  default true
timestamps      createdAt, updatedAt
```

### User

```
phone       String   unique, Indian format /^[6-9]\d{9}$/
role        Enum: customer | mechanic | administrator
name        String
email       String
address     String
avatar      String
mechanicId  ObjectId → Mechanic  (for mechanic-role users)
lastLogin   Date
isActive    Boolean
timestamps  createdAt, updatedAt
```

### Service

```
name          String   required
price         Number   required
description   String
durationMins  Number   default 60
```

### Notification

```
recipient   ObjectId (polymorphic via refPath)
role        Enum: customer | mechanic | administrator
type        String
title       String
body        String
booking     ObjectId → Booking
read        Boolean
readAt      Date
channels    { push: { sent, sentAt }, sms: { sent, sentAt } }
timestamps  createdAt, updatedAt
```

---

## Key Services

### mechanicAssignmentService

`assignMechanic()` — called on every booking creation:
1. Finds all active mechanics.
2. For each, counts today's ASSIGNED + IN_PROGRESS bookings.
3. Returns the first mechanic under the daily cap of 3.
4. If none available, returns `{ mechanicId: null, status: "WAITLISTED" }`.

`reassignWaitlisted(mechanicId)` — called on booking COMPLETED or CANCELLED:
1. Finds the oldest WAITLISTED booking.
2. Assigns the now-free mechanic to it.
3. Sends a push notification to the customer.

### paymentService

- Wraps Razorpay `orders.create()`.
- Detects mock mode when `RAZORPAY_KEY_ID` is absent or placeholder.
- In mock mode, returns a fake order with `isMock: true` — the booking controller auto-marks payment as PAID.
- `verifyPayment(orderId, paymentId, signature)` — HMAC-SHA256 signature check; returns `true` in mock mode.

### notificationService

- Wraps Expo Server SDK `sendPushNotificationsAsync`.
- Called from `bookingController` at status transitions: new booking (→ mechanic), IN_PROGRESS (→ customer), COMPLETED (→ customer), ETA update (→ customer).

---

## Booking State Machine

```
                 ┌─────────────────────────────────┐
                 │           createBooking          │
                 └────────────┬────────────────────┘
                              │
              ┌───────────────┴───────────────┐
         mechanic                        no mechanic
         available                       available
              │                               │
              ▼                               ▼
         ASSIGNED                        WAITLISTED
              │                               │
              │                    mechanic becomes free
              │                               │
              │                               ▼
              │                          ASSIGNED
              │                               │
              ▼                               │
         IN_PROGRESS ◄─────────────────────────┘
              │
              ├──────────────► CANCELLED  (only from ASSIGNED or WAITLISTED)
              │
              ▼
         COMPLETED
              │
              ▼
     Razorpay order created
              │
        ┌─────┴──────┐
      mock          real
        │              │
        ▼              ▼
      PAID         AWAITING
                       │
               customer pays
                       │
                       ▼
                     PAID  (or FAILED on bad signature)
```

---

## Authentication Flow

### Customer / New User

```
PhoneEntryScreen
  → POST /auth/send-otp  (Twilio Verify SMS)
  → OtpVerifyScreen
  → POST /auth/verify-otp
      finds or creates User doc
      returns JWT (30d expiry)
  → token saved to AsyncStorage
  → navigation.replace("Customer")
```

### Mechanic

```
MechanicLoginScreen
  → POST /mechanics/login  (name + PIN)
  → JWT returned (7d expiry)
  → token saved to AsyncStorage
  → navigation.replace("MechanicApp")
```

### Admin

```
AdminLoginScreen
  → POST /admin/login  (static password)
  → JWT returned (7d expiry)
  → token saved to AsyncStorage
  → navigation.replace("AdminApp")
```

> JWT payload differences: customer tokens carry `{ id, phone, role }`, mechanic tokens carry `{ id, name, role: "mechanic" }`, admin tokens carry `{ role: "administrator", name: "Admin" }`.

---

## Mechanic Assignment Logic

```
createBooking request arrives
        │
        ▼
Mechanic.find({ isActive: true })
        │
        ▼
For each mechanic:
  count Bookings where
    mechanicId = mechanic._id
    status IN [ASSIGNED, IN_PROGRESS]
    createdAt >= today 00:00
        │
        ▼
  dailyCount < 3?
    YES → assign this mechanic → status = ASSIGNED
    NO  → try next mechanic
        │
  all full?
    YES → status = WAITLISTED, mechanicId = null
```

When a job is COMPLETED or CANCELLED:
```
reassignWaitlisted(freedMechanicId)
  → find oldest WAITLISTED booking
  → set mechanicId = freedMechanicId, status = ASSIGNED
  → push notification to customer
```

---

## Notification Architecture

```
Trigger (bookingController)
        │
        ▼
sendPushNotification(token, title, body, data)
        │
        ▼
Expo Server SDK
  → Expo Push Service
        │
        ▼
  Device (FCM on Android, APNs on iOS)
```

Notification triggers:

| Event | Recipient | Message |
|---|---|---|
| Booking created (mechanic assigned) | Mechanic | "New Booking! 🔧" |
| Status → IN_PROGRESS | Customer | "Mechanic On the Way! 🏍️" |
| Status → COMPLETED | Customer | "Service Completed! ✅" |
| ETA updated | Customer | "ETA Updated ⏱️" |
| Waitlist assigned | Customer | (via reassignWaitlisted) |

> Push tokens are only available in production builds. Expo Go detection (`Constants.appOwnership === "expo"`) skips token registration automatically — no errors in development.

---

## Payment Architecture

```
BOOKING CREATED
  paymentStatus = PENDING
  (no Razorpay order yet)
        │
        ▼
MECHANIC MARKS COMPLETED
  bookingController.updateBookingStatus("COMPLETED")
        │
        ▼
paymentService.createOrder(service.price, "INR", receipt)
        │
   ┌────┴─────┐
 mock        real
   │           │
   ▼           ▼
auto PAID   paymentStatus = AWAITING
            paymentOrderId saved
                │
                ▼
        Customer pays via
        react-native-razorpay
                │
                ▼
    POST /bookings/:id/payment/verify
        { razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature }
                │
                ▼
    HMAC-SHA256 signature check
        │           │
      valid       invalid
        │           │
        ▼           ▼
    PAID        FAILED
```

---

## Design System

All design tokens live in `src/utils/theme.js` and are imported across every screen and navigator.

| Token group | Purpose |
|---|---|
| `COLORS` | All color values including role-specific accents (`adminAccent`, `mechanicAccent`), semantic colors (`success`, `warning`, `error`), and surface/bg tokens |
| `FONTS` | Font weight presets — `regular`, `medium`, `semiBold`, `bold`, `extraBold` |
| `FONT_SIZE` | Scale — `xs`, `sm`, `base`, `md`, `lg`, `xl`, `xxl`, `xxxl` |
| `SPACING` | Base-8 scale — `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, plus `screen` for horizontal page padding |
| `RADIUS` | Corner radius presets — `sm`, `md`, `lg`, `xl`, `xxl` |
| `SHADOW` | Elevation presets — `sm`, `md`, `accent` |

Role accent colors:

| Role | Accent |
|---|---|
| Customer | `COLORS.primaryDark` (green family) |
| Mechanic | `COLORS.mechanicAccent` |
| Admin | `COLORS.adminAccent` (purple family) |