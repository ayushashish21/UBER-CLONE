# 🚖 Uber Clone

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?logo=socketdotio)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-0C6CF2)
![Mapbox](https://img.shields.io/badge/Mapbox-Maps-000000?logo=mapbox)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern **full-stack Uber Clone** built with the **MERN Stack**, featuring **real-time ride booking**, **live captain updates**, **OTP-based ride completion**, **online payments with Razorpay**, **Mapbox integration**, **ride history**, and a responsive user experience.

---

# 🌐 Live Demo

**Frontend**

https://ayushashish21.github.io/UBER-CLONE/

> **Note**
>
> GitHub Pages hosts only the frontend.
> The backend should be deployed separately (Render, Railway, VPS, etc.) for full functionality.

---

# ✨ Features

## 👤 User

- User Registration & Login
- JWT Authentication
- Protected Routes
- Search Pickup & Destination
- Mapbox Autocomplete
- Dynamic Fare Calculation
- Book Ride
- Real-Time Captain Assignment
- Live Ride Status Updates
- Razorpay Payment Integration
- OTP Verification
- Ride History
- Ride Details Page
- Responsive UI

---

## 🚖 Captain

- Captain Registration & Login
- Protected Dashboard
- Receive Ride Requests
- Accept / Reject Ride
- Real-Time Ride Updates
- Ride Completion via OTP
- View Ride Details
- Live Ride Workflow

---

## ⚡ Real-Time Features

Powered by **Socket.IO**

- Instant Ride Requests
- Live Captain Assignment
- Ride Status Synchronization
- Ride Acceptance Updates
- OTP Verification Events
- Ride Completion Events

---

## 💳 Payment System

Integrated using **Razorpay**

- Secure Order Creation
- Razorpay Checkout
- Payment Verification
- Backend Validation
- Payment Status Tracking
- Ride Completion after Successful Payment

---

## 📜 Ride History

Users can

- View Previous Rides
- Check Ride Status
- View Fare Details
- Open Ride Details
- View Payment Status
- Access Completed Trips

---

## 🚖 Ride Details

Each ride displays

- Pickup Location
- Destination
- Captain Information
- Vehicle Information
- Fare Breakdown
- Payment Status
- Ride Timeline
- Ride Status

---

# 🚦 Ride Lifecycle

```
User Login
      │
      ▼
Book Ride
      │
      ▼
Fare Estimation
      │
      ▼
Nearby Captain Receives Request
      │
      ▼
Captain Accepts Ride
      │
      ▼
User Receives Captain Details
      │
      ▼
Ride Starts
      │
      ▼
Online Payment
      │
      ▼
OTP Verification
      │
      ▼
Ride Completed
      │
      ▼
Ride Saved in History
```

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- GSAP
- Mapbox GL JS
- Remix Icons
- Socket.IO Client

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO
- Razorpay

---

## Database

- MongoDB Atlas

---

# 📂 Project Structure

```
UBER-CLONE
│
├── Backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── sockets
│   ├── utils
│   ├── app.js
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │
│   ├── assets
│   ├── components
│   ├── context
│   ├── pages
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── package.json
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/ayushashish21/UBER-CLONE.git

cd UBER-CLONE
```

---

# Backend Setup

```bash
cd Backend

npm install
```

Create `.env`

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret

MAPBOX_ACCESS_TOKEN=your_mapbox_token

RAZORPAY_KEY_ID=your_key

RAZORPAY_KEY_SECRET=your_secret
```

Run Backend

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_BASE_URL=http://localhost:5000

VITE_MAPBOX_ACCESS_TOKEN=your_public_mapbox_token

VITE_RAZORPAY_KEY=your_public_key
```

Run Frontend

```bash
npm run dev
```

---

# Production Build

```bash
npm run build
```

Preview Production Build

```bash
npm run preview
```

---

# 🔗 REST API Modules

Backend APIs include

- User Authentication
- Captain Authentication
- Ride Booking
- Fare Estimation
- Ride Management
- Ride History
- Payment
- OTP Verification
- Maps & Geolocation

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Secure Payment Verification
- Environment Variables
- Backend Authorization Middleware

---

# 🗺 Maps

Powered by **Mapbox**

Features

- Address Autocomplete
- Pickup Suggestions
- Destination Suggestions
- Route Information
- Distance Calculation
- Fare Estimation

---

# 📱 Responsive Design

The application is optimized for

- Desktop
- Laptop
- Tablet
- Mobile Devices

---

# 🚀 Deployment

### Frontend

- GitHub Pages

### Backend

Deployable on

- Render
- Railway
- VPS
- AWS
- DigitalOcean

### Database

- MongoDB Atlas

---

# 📸 Screenshots

## Landing Page

_Add Screenshot_

---

## User Dashboard

_Add Screenshot_

---

## Captain Dashboard

_Add Screenshot_

---

## Ride Booking

_Add Screenshot_

---

## Payment

_Add Screenshot_

---

## Ride History

_Add Screenshot_

---

## Ride Details

_Add Screenshot_

---

# 🔮 Future Improvements

- Live Driver Tracking
- Ratings & Reviews
- Push Notifications
- Scheduled Rides
- Multiple Payment Methods
- Driver Earnings Dashboard
- Admin Dashboard
- Promo Codes
- Dark Mode
- Ride Cancellation Charges

---

# 💡 Skills Demonstrated

- MERN Stack Development
- REST API Design
- Authentication & Authorization
- JWT Security
- Socket.IO Real-Time Communication
- Razorpay Payment Gateway
- Mapbox Integration
- MongoDB Database Design
- React Context API
- Responsive UI Development
- Component-Based Architecture
- State Management
- Git & GitHub
- Deployment
- Environment Variable Management

---

# 👨‍💻 Author

## Ayush Ashish

**GitHub**

https://github.com/ayushashish21

**LinkedIn**

https://www.linkedin.com/in/n-ayush-ashish-119b95360/

---

# 📄 License

This project is intended for **learning**, **portfolio**, and **educational** purposes.

---

## ⭐ Support

If you found this project helpful or interesting, please consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and supports future development.