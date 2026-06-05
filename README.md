# Mechiee Two-Wheeler Service Platform

## Overview

Mechiee is a full-stack mobile application designed to streamline doorstep two-wheeler service management. The platform enables customers to book vehicle services, automatically assigns mechanics based on real-time workload, and manages booking capacity through an intelligent waitlisting system.

The application has been designed with separate customer and mechanic workflows, providing a role-based experience similar to a real-world service management platform.

### Tech Stack

* React Native (Expo)
* React Navigation
* Axios
* React Native Toast Message
* Node.js
* Express.js
* MongoDB
* Mongoose

---

# Key Features

## Customer Portal

Customers can:

* Browse available services
* Book a two-wheeler service
* View booking history
* Track booking status
* View assigned mechanic information

### Customer Screens

* Home
* Book Service
* Booking History

---

## Mechanic Portal

Mechanics can:

* View assigned bookings
* Track active workload
* Update booking progress
* Mark jobs as completed
* Monitor daily booking capacity

### Mechanic Screens

* Team Dashboard
* Assigned Bookings
* Booking Status Management

---

# Booking Workflow

Customer creates a booking

↓

Service selected

↓

Automatic mechanic assignment

↓

Booking assigned if mechanic capacity available

↓

Booking status progresses:

ASSIGNED → IN_PROGRESS → COMPLETED

↓

If all mechanics reach daily capacity:

WAITLISTED

---

# Mechanic Assignment Logic

The platform implements automatic workload balancing.

### Assignment Rules

1. Retrieve all mechanics.

2. Calculate today's active bookings for each mechanic.

3. Count only:

   * ASSIGNED
   * IN_PROGRESS

4. Ignore:

   * COMPLETED
   * WAITLISTED

5. Sort mechanics by active booking count.

6. Assign booking to the least busy mechanic.

7. If all mechanics have reached capacity:

   * No mechanic is assigned.
   * Booking is marked as WAITLISTED.

### Daily Capacity Rule

Each mechanic can handle a maximum of:

3 active bookings per day

This capacity is calculated using bookings created during the current day only.

---

# UI & User Experience Improvements

The application includes:

* Dedicated Mechiee branding
* Role selection screen
* Customer and mechanic themed interfaces
* Status badges
* Dashboard summaries
* Pull-to-refresh support
* Loading states
* Empty states
* Error handling screens
* Responsive card-based layouts
* Consistent spacing and typography

---

# Project Structure

```text
Task 1/

├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js

├── Frontend_/
│   ├── src/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── screens/
│   │   ├── services/
│   │   └── utils/
│   └── App.js

├── README.md
├── ARCHITECTURE.md
└── Task1 API Collection.postman_collection.json
```

---

# API Endpoints

## Services

### Get Services

```http
GET /api/services
```

Returns all available services.

---

## Mechanics

### Get Mechanics

```http
GET /api/mechanics
```

Returns mechanic availability and daily workload information.

---

## Bookings

### Get Bookings

```http
GET /api/bookings
```

Returns all bookings.

### Create Booking

```http
POST /api/bookings
```

Creates a booking and automatically assigns a mechanic if available.

### Update Booking Status

```http
PATCH /api/bookings/:id/status
```

Updates booking status.

Supported statuses:

* ASSIGNED
* IN_PROGRESS
* COMPLETED

---

# Installation

## Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start backend:

```bash
npm start
```

---

## Frontend Setup

```bash
cd Frontend_
npm install
npx expo start
```

---

# Error Handling

The application includes:

* Form validation
* API validation
* Network error handling
* Booking validation
* Invalid status protection
* Empty state handling
* User-friendly toast notifications

---

# Documentation

Additional project documentation:

* ARCHITECTURE.md
* Task1 API Collection.postman_collection.json

---

# Future Enhancements

* Authentication & authorization
* Mechanic login portal
* Customer profiles
* Push notifications
* Service scheduling
* Payment integration
* Real-time booking updates

---

# Author

**Anuja Kale**

Mechiee Technical Assessment Submission
