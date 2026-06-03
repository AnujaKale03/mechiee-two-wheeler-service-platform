# Application Architecture

## High-Level Architecture

Frontend (React Native)
|
v
Backend API (Express.js)
|
v
MongoDB Database

The frontend communicates with backend REST APIs using Axios. The backend performs business logic and interacts with MongoDB using Mongoose.

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

Service (1)
|
|
(Many)
Booking
|
|
(Many)
Mechanic (1)

Relationship Summary:

* One Service can have many Bookings.
* One Mechanic can handle many Bookings.
* Each Booking belongs to one Service.
* Each Booking may be assigned to one Mechanic.

---

# API Design

## GET /api/services

Description:

Returns all available service packages.

Response:

```json
[
  {
    "_id": "id",
    "name": "Standard Service",
    "price": 499
  }
]
```

---

## GET /api/mechanics

Description:

Returns all mechanics with active booking counts.

Response:

```json
[
  {
    "_id": "id",
    "name": "Mechanic A",
    "activeBookingCount": 2
  }
]
```

---

## GET /api/bookings

Description:

Returns all bookings.

Response:

```json
[
  {
    "_id": "id",
    "customerName": "Rahul",
    "bikeModel": "Activa 6G",
    "status": "ASSIGNED"
  }
]
```

---

## POST /api/bookings

Description:

Creates a booking and performs mechanic assignment.

Request:

```json
{
  "customerName": "Rahul",
  "bikeModel": "Activa 6G",
  "serviceId": "service_id"
}
```

Response (Assigned):

```json
{
  "success": true,
  "status": "ASSIGNED",
  "message": "Booking assigned successfully"
}
```

Response (Waitlisted):

```json
{
  "success": true,
  "status": "WAITLISTED",
  "message": "Booking waitlisted"
}
```

---

# Mechanic Assignment Logic

Business Rules:

1. Each mechanic can handle a maximum of 3 active bookings.
2. Mechanic with lowest workload receives the next booking.
3. If multiple mechanics have equal workload, the first available mechanic is selected.
4. When all mechanics reach maximum capacity, booking is waitlisted.

Algorithm:

1. Fetch all mechanics.
2. Calculate active bookings per mechanic.
3. Sort mechanics by workload.
4. Select mechanic with lowest count.
5. Assign booking if count < 3.
6. Otherwise create WAITLISTED booking.

---

# Middleware

## Logger Middleware

Purpose:

Logs incoming requests.

Example Output:

GET /api/services

POST /api/bookings

---

# Assumptions

1. All mechanics have equal skill levels.
2. Maximum workload per mechanic is fixed at 3 active bookings.
3. Waitlisted bookings are not automatically reassigned.
4. Authentication and authorization are not required for this assignment.
5. Service records and mechanic records are pre-seeded in the database.
6. Only booking creation workflow is implemented.

---

# Design Decisions

* Service layer used to separate business logic from controllers.
* Axios service layer used on frontend for API integration.
* MongoDB chosen for flexible document storage.
* Express middleware used for logging and request processing.
* Waitlisting implemented to prevent mechanic overload.

---

# Future Enhancements

* User authentication
* Mechanic login portal
* Booking status updates
* Waitlist reassignment automation
* Admin dashboard
* Notifications and reminders
