# Mechiee Two Wheeler Service Platform

## Overview

Mechiee is a full-stack application developed for managing two-wheeler service bookings. The platform allows customers to book bike services, automatically assigns available mechanics based on workload, and supports waitlisting when all mechanics are occupied.

The application consists of:

* React Native (Expo) Frontend
* Node.js + Express Backend
* MongoDB Database

---

## Features

### Customer Features

* View available services
* Create service bookings
* View booking history

### Mechanic Management

* View mechanic dashboard
* Track active booking counts
* Automatic workload balancing

### Booking Management

* Automatic mechanic assignment
* Maximum 3 active bookings per mechanic
* Waitlisting when all mechanics are busy

### Error Handling

* Input validation
* API error handling
* Empty state handling
* Network failure handling

---

## Technology Stack

### Frontend

* React Native
* Expo
* React Navigation
* Axios
* React Native Toast Message

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* CORS
* Dotenv

---

## Project Structure

Task 1/

├── Backend/

│ ├── config/

│ ├── controllers/

│ ├── middleware/

│ ├── models/

│ ├── routes/

│ ├── services/

│ └── server.js

├── Frontend_/

│ ├── src/

│ │ ├── components/

│ │ ├── navigation/

│ │ ├── screens/

│ │ ├── services/

│ │ └── utils/

│ └── App.js

├── README.md

├── ARCHITECTURE.md

└── Task1 API Collection.postman_collection.json

---

## Installation

### Backend Setup

Navigate to backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create .env file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start server:

```bash
npm start
```

---

### Frontend Setup

Navigate to frontend:

```bash
cd Frontend_
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

---

## API Endpoints

### Services

GET /api/services

Returns all available services.

### Mechanics

GET /api/mechanics

Returns all mechanics and active booking counts.

### Bookings

GET /api/bookings

Returns all bookings.

POST /api/bookings

Creates a new booking.

---

## Mechanic Assignment Logic

1. Retrieve all mechanics.
2. Calculate active booking count for each mechanic.
3. Select mechanic with lowest workload.
4. If active bookings < 3:

   * Assign mechanic.
   * Mark booking as ASSIGNED.
5. Otherwise:

   * Create booking without mechanic.
   * Mark booking as WAITLISTED.

---

## Documentation

Additional documentation is available in:

* ARCHITECTURE.md
* Task1 API Collection.postman_collection.json

---

## Author

Anuja Kale
