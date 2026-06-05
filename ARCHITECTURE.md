# Application Architecture

# Overview

Mechiee Two-Wheeler Service Platform is a full-stack mobile application designed to manage doorstep two-wheeler service bookings.

The system consists of:

* React Native (Expo) Mobile Application
* Node.js + Express REST API
* MongoDB Database

The application supports separate customer and mechanic workflows, automatic mechanic assignment, booking status tracking, and waitlist management.

---

# High-Level Architecture

```text
+----------------------+
|  React Native App    |
| (Customer/Mechanic)  |
+----------+-----------+
           |
           | Axios HTTP Requests
           v
+----------------------+
|  Express.js Backend  |
|  REST API Layer      |
+----------+-----------+
           |
           | Mongoose ODM
           v
+----------------------+
|      MongoDB         |
+----------------------+
```

---

# Application Flow

## Customer Journey

```text
Role Selection
       ↓
Customer Portal
       ↓
Home Screen
       ↓
Book Service
       ↓
Booking Created
       ↓
Mechanic Assigned / Waitlisted
       ↓
Booking History
```

---

## Mechanic Journey

```text
Role Selection
       ↓
Mechanic Portal
       ↓
Dashboard
       ↓
Assigned Bookings
       ↓
Update Status
       ↓
Completed Job
```

---

# Frontend Architecture

## Navigation Structure

### Root Stack Navigator

```text
Role Selection
      ├── Customer Navigator
      └── Mechanic Navigator
```

---

### Customer Navigator

Bottom Tab Navigation

```text
Home
Book Service
Bookings
```

---

### Mechanic Navigator

Bottom Tab Navigation

```text
Dashboard
My Jobs
```

---

# Backend Architecture

The backend follows a layered architecture:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB
```

---

## Responsibilities

### Routes

Defines API endpoints.

Examples:

```text
/api/services
/api/mechanics
/api/bookings
```

---

### Controllers

Handle request validation and responses.

Examples:

* serviceController.js
* mechanicController.js
* bookingController.js

---

### Services

Contains business logic.

Example:

```text
mechanicAssignmentService.js
```

Responsible for:

* Workload balancing
* Capacity validation
* Waitlist management

---

### Models

MongoDB schemas using Mongoose.

Examples:

* Service
* Mechanic
* Booking

---

# Database Design

## Collections

### Service

Stores available service packages.

Fields:

* _id
* name
* price

Example:

```json
{
  "name": "Standard Service",
  "price": 499
}
```

---

### Mechanic

Stores mechanic information.

Fields:

* _id
* name

Example:

```json
{
  "name": "Mechanic A"
}
```

---

### Booking

Stores customer bookings.

Fields:

* _id
* customerName
* bikeModel
* serviceId
* mechanicId
* status
* createdAt
* updatedAt

Example:

```json
{
  "customerName": "Rahul",
  "bikeModel": "Activa 6G",
  "serviceId": "serviceId",
  "mechanicId": "mechanicId",
  "status": "ASSIGNED"
}
```

---

# Entity Relationships

```text
Service (1)
     |
     |----< Booking >----|
                          |
                          |
                    Mechanic (1)
```

Relationship Summary:

* One Service can have many Bookings.
* One Mechanic can have many Bookings.
* Each Booking belongs to one Service.
* Each Booking may be assigned to one Mechanic.
* Waitlisted bookings have no mechanic assigned.

---

# API Design

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

Returns mechanics with:

* Daily booking count
* Availability status
* Capacity information

Example:

```json
[
  {
    "_id": "id",
    "name": "Mechanic A",
    "todayBookingCount": 2,
    "maxCapacity": 3,
    "isAvailable": true
  }
]
```

---

## Bookings

### Get Bookings

```http
GET /api/bookings
```

Returns all bookings.

---

### Create Booking

```http
POST /api/bookings
```

Request:

```json
{
  "customerName": "Rahul",
  "bikeModel": "Activa 6G",
  "serviceId": "service_id"
}
```

Response:

```json
{
  "success": true,
  "status": "ASSIGNED",
  "message": "Booking Created Successfully"
}
```

---

### Update Booking Status

```http
PATCH /api/bookings/:id/status
```

Updates booking status.

Supported statuses:

* ASSIGNED
* IN_PROGRESS
* COMPLETED

Example:

```json
{
  "status": "IN_PROGRESS"
}
```

---

# Mechanic Assignment Logic

## Business Rules

* Maximum 3 active bookings per mechanic per day.
* Capacity is calculated per day, not globally.
* Only active bookings count toward capacity.
* Active statuses:

  * ASSIGNED
  * IN_PROGRESS

Ignored statuses:

* COMPLETED

* WAITLISTED

* Booking is assigned to the least busy mechanic.

* If all mechanics reach capacity, booking is waitlisted.

---

## Assignment Algorithm

1. Fetch all mechanics.
2. Calculate today's active booking count.
3. Sort mechanics by workload.
4. Select mechanic with lowest count.
5. If booking count < 3:

   * Assign mechanic.
   * Mark booking as ASSIGNED.
6. Otherwise:

   * Create booking without mechanic.
   * Mark booking as WAITLISTED.

---

# Booking Status Lifecycle

```text
ASSIGNED
    ↓
IN_PROGRESS
    ↓
COMPLETED
```

Mechanics can update booking status from the mobile application.

---

# Middleware

## Logger Middleware

Logs incoming requests.

Example:

```text
GET /api/services
POST /api/bookings
PATCH /api/bookings/:id/status
```

---

## Error Middleware

Provides centralized error handling and API error responses.

---

# Design Decisions

## Role-Based Navigation

Customer and mechanic workflows are separated to improve usability and mimic a real-world product experience.

---

## Daily Capacity Management

Mechanic workload is calculated using active bookings created during the current day, ensuring fair distribution and preventing overload.

---

## Service Layer Pattern

Business logic is separated from controllers to improve maintainability and scalability.

---

## Waitlist Strategy

When all mechanics reach capacity, bookings are waitlisted rather than rejected to preserve customer requests.

---

# Assumptions

* All mechanics have equal skill levels.
* Maximum capacity is fixed at three active bookings per day.
* Waitlisted bookings are not automatically reassigned.
* Service and mechanic data are pre-seeded.
* Authentication is outside the scope of this assessment.

---

# Future Enhancements

* Authentication & Authorization
* Customer Accounts
* Mechanic Login Portal
* Admin Dashboard
* Automatic Waitlist Reassignment
* Push Notifications
* Service Scheduling
* Payment Integration
* Analytics Dashboard

---

# Author

Anuja Kale

Mechiee Technical Assessment Submission
