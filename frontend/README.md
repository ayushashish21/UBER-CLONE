# 🚖 Uber Clone (MERN Stack)

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" width="250" alt="Uber Logo">
</p>

<p align="center">

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real_Time-black?logo=socketdotio)
![Mapbox](https://img.shields.io/badge/Mapbox-Maps-blue?logo=mapbox)
![JWT](https://img.shields.io/badge/JWT-Authentication-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

</p>

---

# 📖 About

Uber Clone is a full-stack ride booking application inspired by Uber.

The project is built using the **MERN Stack** and provides a complete real-time ride booking experience between Riders and Captains (Drivers).

It includes authentication, live GPS tracking, Socket.IO communication, Mapbox integration, OTP verification, ride lifecycle management, and a modern responsive UI.

> 🚧 **Current Status:** Core Ride Flow Completed. Razorpay Payment Integration is the next milestone.

---

# ✨ Features

## 👤 Rider

- Register & Login
- JWT Authentication
- Protected Routes
- Search Pickup & Destination
- Mapbox Address Suggestions
- Fare Calculation
- Select Vehicle
- Book Ride
- Wait for Driver
- Live Ride Status
- View Captain Details
- OTP Ride Verification
- Ride Completion Notification

---

## 🚖 Captain

- Register & Login
- JWT Authentication
- Protected Routes
- Live GPS Tracking
- Receive Ride Requests
- Accept Ride
- Start Ride
- Complete Ride
- OTP Verification
- Real-Time Updates

---

## 🌍 Maps

- Mapbox Geocoding API
- Mapbox Directions API
- Address Autocomplete
- Live GPS
- Dynamic Fare Calculation

---

## ⚡ Real-Time Features

Implemented using Socket.IO

- Live Socket Connection
- User Join
- Captain Join
- Live Captain GPS
- New Ride Broadcast
- Ride Confirmation
- Ride Start
- Ride Completion
- Instant UI Updates

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- GSAP
- Socket.IO Client
- Tailwind CSS
- Remix Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Socket.IO
- Express Validator
- Dotenv

---

## APIs

- Mapbox Geocoding API
- Mapbox Directions API

---

# 📂 Folder Structure

```
Uber Clone
│
├── Backend
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── socket.js
│   ├── app.js
│   └── server.js
│
├── Frontend
│   ├── components
│   ├── context
│   ├── pages
│   ├── assets
│   └── App.jsx
│
└── README.md
```

---

# 🔐 Authentication

Both Riders and Captains use

- JWT Authentication
- Protected Routes
- Bcrypt Password Hashing

---

# 🚖 Ride Workflow

```
User Login
      │
      ▼
Enter Pickup
      │
      ▼
Enter Destination
      │
      ▼
Calculate Fare
      │
      ▼
Choose Vehicle
      │
      ▼
Create Ride
      │
      ▼
Nearby Captains Receive Ride
      │
      ▼
Captain Accepts Ride
      │
      ▼
User Gets Confirmation
      │
      ▼
Captain Starts Ride
      │
      ▼
Ride In Progress
      │
      ▼
OTP Verification
      │
      ▼
Ride Completed
```

---

# 📡 Socket Events

### Client → Server

```
join
updateLocationCaptain
```

### Server → Client

```
new-ride
ride-confirmed
ride-started
ride-ended
captain-location-update
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/ayushashish21/uber-clone.git
```

---

## Backend

```bash
cd Backend

npm install
```

Run

```bash
npm run dev
```

or

```bash
npx nodemon
```

---

## Frontend

```bash
cd Frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
PORT=4000

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_ACCESS_TOKEN

RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY

RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET
```

---

## Frontend (.env)

```env
VITE_BASE_URL=http://localhost:4000/api

VITE_MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_ACCESS_TOKEN

VITE_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY
```

---

# ✅ Completed Features

- User Authentication
- Captain Authentication
- Protected Routes
- JWT Authorization
- MongoDB Integration
- Socket Context
- Live Socket Connection
- Ride Creation
- Fare Calculation
- Nearby Captain Search
- Ride Acceptance
- Ride Confirmation
- Ride Start
- OTP Verification
- Ride Completion
- MongoDB Ride Synchronization
- Live Captain GPS Tracking
- Mapbox Integration
- Modern Responsive UI

---

# 🚧 Currently Working On

- Razorpay Payment Integration

---

# 🗺 Future Roadmap

- Live Route Navigation
- Captain Marker Movement
- Ride History
- Captain Earnings
- Ratings & Reviews
- Online / Offline Status
- Ride Cancellation
- Ride Timestamps
- Payment History
- Push Notifications
- Admin Dashboard
- Booking Scheduler

---

# 📸 Screens

- Login
- Register
- Home
- Vehicle Selection
- Confirm Ride
- Looking For Driver
- Waiting For Driver
- Captain Dashboard
- Ride Popup
- Riding Screen

(Add screenshots here after deployment.)

---

# 👨‍💻 Developer

### Ayush Ashish

GitHub

https://github.com/ayushashish21

LinkedIn

https://www.linkedin.com/in/n-ayush-ashish-119b95360/

---

# 🎯 Goal

Build a production-ready ride-hailing platform featuring:

- Razorpay Payments
- Live Navigation
- Real-Time GPS Tracking
- Ride History
- Driver Earnings
- Ratings & Reviews
- Production Deployment

---

# 📄 License

This project is developed for educational and portfolio purposes.

Feel free to fork and contribute.