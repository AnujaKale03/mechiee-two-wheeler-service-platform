# Mechiee 🔧

**Your Trusted Mechanical Service** — an on-demand bike servicing platform that connects customers with verified mechanics at their doorstep.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [User Roles](#user-roles)
- [Key Features](#key-features)
- [Payment Flow](#payment-flow)
- [Push Notifications](#push-notifications)

---

## Overview

Mechiee is a full-stack mobile application built with React Native (Expo) on the frontend and Node.js + Express + MongoDB on the backend. It supports three user roles — Customer, Mechanic, and Admin — each with their own dedicated interface and navigation flow.

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React Native 0.85.3 + Expo SDK 56 |
| Navigation | React Navigation 7 (Native Stack + Bottom Tabs) |
| HTTP Client | Axios |
| Auth Storage | AsyncStorage |
| OTP Auth | Firebase (Phone Auth) + Twilio fallback |
| Maps | react-native-maps |
| Payments | react-native-razorpay |
| Push Tokens | expo-notifications (production builds only) |
| Icons | @expo/vector-icons (Ionicons) |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js + Express 4 |
| Database | MongoDB Atlas via Mongoose 7 |
| Auth | JWT (jsonwebtoken) + Twilio Verify OTP |
| Payments | Razorpay (mock mode when keys absent) |
| Push Notifications | Expo Server SDK |
| SMS | Twilio |
| Admin Auth | Static password + JWT |

---

## Project Structure

```
Mechiee Tasks/Task 1/
├── Frontend/
│   └── src/
│       ├── navigation/
│       │   ├── AppNavigator.js          # Root stack navigator
│       │   ├── CustomerNavigator.js     # Customer bottom tabs
│       │   ├── MechanicNavigator.js     # Mechanic bottom tabs
│       │   └── AdminNavigator.js        # Admin bottom tabs
│       ├── screens/
│       │   ├── WelcomeScreen.js
│       │   ├── RoleSelectionScreen.js
│       │   ├── auth/
│       │   │   ├── PhoneEntryScreen.js
│       │   │   ├── OtpVerifyScreen.js
│       │   │   └── AuthSuccessScreen.js
│       │   ├── customer/
│       │   │   ├── HomeScreen.js
│       │   │   ├── BookServiceScreen.js
│       │   │   └── BookingHistoryScreen.js
│       │   ├── mechanic/
│       │   │   ├── MechanicProfileScreen.js
│       │   │   └── BookingsScreen.js
│       │   └── admin/
│       │       ├── AdminLoginScreen.js
│       │       ├── DashboardScreen.js
│       │       ├── CustomersScreen.js
│       │       ├── MechanicsScreen.js
│       │       └── WaitlistedScreen.js
│       ├── services/                    # Axios API call wrappers
│       └── utils/
│           ├── theme.js                 # Design tokens (COLORS, FONTS, SPACING…)
│           └── constants.js
│
└── Backend/
    ├── server.js
    ├── .env
    ├── controllers/
    │   ├── adminController.js
    │   ├── authController.js
    │   ├── bookingController.js
    │   ├── mechanicController.js
    │   └── serviceController.js
    ├── models/
    │   ├── Booking.js
    │   ├── Mechanic.js
    │   ├── Notification.js
    │   ├── Service.js
    │   └── User.js
    ├── routes/
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── bookingRoutes.js
    │   ├── chatRoutes.js
    │   ├── mechanicRoutes.js
    │   ├── notifications.js
    │   └── serviceRoutes.js
    └── services/
        ├── mechanicAssignmentService.js
        ├── notificationService.js
        └── paymentService.js
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Expo CLI: `npm install -g expo-cli`
- Android Studio or Xcode (for device emulation)

### Backend Setup

```bash
cd "Mechiee Tasks/Task 1/Backend"
npm install
cp .env.example .env        # fill in your values
npm run dev                 # starts on port 5000 with nodemon
```

### Frontend Setup

```bash
cd "Mechiee Tasks/Task 1/Frontend"
npm install
npx expo start              # scan QR with Expo Go or run on emulator
```

> **Note:** Push notifications (expo-notifications) require a development build or production APK. They are automatically skipped when running in Expo Go.

---

## Environment Variables

Create a `.env` file in the Backend root. All required keys:

```dotenv
PORT=5000
MONGO_URI=                      # MongoDB Atlas connection string
JWT_SECRET=                     # Random 64-char hex string
ADMIN_PASSWORD=                 # Static password for admin login

# Razorpay (leave blank to enable mock/test mode)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Twilio OTP
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
TWILIO_PHONE_NUMBER=

# Firebase Admin SDK (for FCM push notifications)
FCM_PROJECT_ID=
FCM_CLIENT_EMAIL=
FCM_PRIVATE_KEY=
```

> **Test OTP:** Use `000000` as the OTP in development — the backend has a bypass for this code so you don't consume Twilio credits.

> **Mock payments:** If `RAZORPAY_KEY_ID` is blank or set to `your_key_here`, the backend runs in mock payment mode and auto-verifies all payments.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/send-otp` | Send OTP to phone number |
| POST | `/auth/verify-otp` | Verify OTP, return JWT |
| GET | `/auth/me` | Get current user profile |
| POST | `/bookings` | Create a new booking |
| GET | `/bookings` | List bookings (filter by customerName) |
| PATCH | `/bookings/:id/status` | Update booking status (mechanic) |
| PATCH | `/bookings/:id/cancel` | Cancel a booking |
| PATCH | `/bookings/:id/eta` | Update ETA |
| POST | `/bookings/:id/rate` | Submit a star rating |
| POST | `/bookings/:id/payment/verify` | Verify Razorpay payment |
| GET | `/services` | List all available services |
| POST | `/mechanics/login` | Mechanic PIN login |
| GET | `/mechanics` | List all active mechanics |
| GET | `/mechanics/:id/profile` | Mechanic profile + stats |
| GET | `/mechanics/:id/bookings` | Mechanic's own bookings |
| PATCH | `/mechanics/:id/push-token` | Save Expo push token |
| POST | `/admin/login` | Admin password login |
| GET | `/admin/analytics` | Platform stats for dashboard |
| GET | `/admin/customers` | Aggregated customer list |
| GET | `/admin/waitlisted` | All waitlisted bookings |

---

## User Roles

### Customer
Authenticates via phone OTP. Can book a bike service, track booking status, view history, and rate completed jobs.

### Mechanic
Authenticates via name + 4-digit PIN. Sees assigned jobs, updates status to IN_PROGRESS or COMPLETED, and sets ETA. Each mechanic handles up to 3 jobs per day.

### Admin
Authenticates via static password. Sees platform analytics, customer list, mechanic roster, and waitlisted bookings.

---

## Key Features

- **Auto mechanic assignment** — on booking creation, the system finds an available mechanic (under daily cap of 3 jobs). If none available, booking is WAITLISTED and auto-assigned when a mechanic completes a job.
- **Waitlist reassignment** — when any job is completed or cancelled, `reassignWaitlisted` runs automatically.
- **Real-time status updates** — mechanics update job status; customers receive push notifications at each stage.
- **Star ratings** — customers rate completed jobs; mechanic's `avgRating` updates in real time.
- **Mock mode** — both Razorpay (payments) and Twilio (OTP) have graceful fallbacks for development without real credentials.

---

## Payment Flow

1. Customer books a service — no payment collected yet.
2. Mechanic marks job `COMPLETED`.
3. Backend creates a Razorpay order at that point (`createOrder`).
4. In mock mode: payment is auto-verified, `paymentStatus` → `PAID`.
5. In production: customer is prompted to pay via `react-native-razorpay`; on success the frontend calls `POST /bookings/:id/payment/verify`.

---

## Push Notifications

- Expo push tokens are saved on booking creation (customer) and via `PATCH /mechanics/:id/push-token` (mechanic).
- Notifications fire on: new booking assigned (mechanic), mechanic on the way (customer), job completed (customer), ETA updated (customer).
- Tokens are only requested in production builds — Expo Go is detected and skipped automatically.