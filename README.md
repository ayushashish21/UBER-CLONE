# 🚖 Uber Clone

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?logo=socketdotio)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment-0C6CF2)
![Mapbox](https://img.shields.io/badge/Mapbox-Maps-000000?logo=mapbox)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern **full-stack Uber Clone** built with the **MERN Stack**, featuring **real-time ride booking**, **live captain updates**, **OTP-based ride completion**, **online payments with Razorpay**, **Mapbox integration**, **ride history for both riders and captains**, a **captain earnings & wallet dashboard**, and a responsive user experience.

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
- Live Dashboard — total rides, earnings, and distance driven, updating in real time via Socket.IO as rides complete
- Ride History — search, filter by status and date range (Today / Week / Month), sort by newest, oldest, or fare
- Wallet & Earnings Dashboard — available balance, today/week/month totals, a 7-day earnings chart, payment method breakdown, and a searchable transaction list

---

## ⚡ Real-Time Features

Powered by **Socket.IO**

- Instant Ride Requests
- Live Captain Assignment
- Ride Status Synchronization
- Ride Acceptance Updates
- OTP Verification Events
- Ride Completion Events
- Live Dashboard Updates (captain's ride count / earnings refresh the moment a ride completes, no page reload needed)

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

## 📜 User Ride History

Users can

- View Previous Rides
- Check Ride Status
- View Fare Details
- Open Ride Details
- View Payment Status
- Access Completed Trips
- Repeat a Past Ride

---

## 📜 Captain Ride History

Captains can

- View Every Ride They've Driven, Most Recent First
- Filter by Status (Pending / Accepted / Ongoing / Completed / Cancelled)
- Filter by Date Range (Today / Week / Month)
- Sort by Newest, Oldest, Highest Fare, or Lowest Fare
- Search by Rider Name, Pickup, or Destination
- Expand Any Ride for the Full Timeline (created → accepted → started → completed → paid) and Payment Status

---

## 💰 Captain Wallet & Earnings

A dedicated earnings dashboard for captains, calculated entirely from completed rides (no separate wallet ledger):

- Available Balance — total of all paid, completed rides
- Today / This Week / This Month earnings summaries
- 7-Day Earnings Chart
- Payment Method Breakdown (Cash / Online)
- Transaction List — one entry per completed ride, with passenger, pickup, destination, amount, payment method, and timestamp
- Search Transactions by Passenger, Location, or Transaction ID
- Filter Transactions by Today / Week / Month / Custom Date Range

> Withdrawals aren't implemented yet — the dashboard reports the balance but there's no payout flow or withdrawal history behind it. See **Future Improvements**.

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
Ride Saved in History (User + Captain) & Reflected in Captain's Wallet
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
- Framer Motion
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
│   │   ├── ride.controller.js       # createRide, getFare, confirm/start/end,
│   │   │                             # getRideHistory, getCaptainRideHistory,
│   │   │                             # getCaptainWallet, getRideById, repeatRide
│   │   └── ...
│   ├── middleware
│   ├── models
│   ├── routes
│   │   ├── ride.routes.js           # includes /captain-history, /captain-wallet
│   │   └── ...
│   ├── services
│   │   ├── ride.service.js          # includes getCaptainRideHistory, getCaptainWallet
│   │   └── ...
│   ├── sockets
│   ├── utils
│   ├── app.js
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   │   ├── CaptainDetails.jsx        # captain dashboard sheet (stats + quick actions)
│   │   │   ├── CaptainCard.jsx
│   │   │   ├── AnimatedNumber.jsx
│   │   │   ├── RideHistoryCard.jsx       # rider-side ride card
│   │   │   ├── CaptainRideHistoryCard.jsx# captain-side ride card
│   │   │   ├── RideHistoryHeader.jsx
│   │   │   ├── RideHistorySkeleton.jsx
│   │   │   ├── RideStatusFilter.jsx
│   │   │   ├── RideDateRangeFilter.jsx
│   │   │   ├── RideSortDropdown.jsx
│   │   │   ├── EmptyRideHistory.jsx
│   │   │   ├── Wallet/
│   │   │   │   ├── WalletHeader.jsx
│   │   │   │   ├── BalanceCard.jsx
│   │   │   │   ├── WalletSummary.jsx
│   │   │   │   ├── EarningsChart.jsx
│   │   │   │   ├── TransactionHistory.jsx
│   │   │   │   ├── TransactionCard.jsx
│   │   │   │   └── WalletSkeleton.jsx
│   │   │   └── ...
│   │   ├── context
│   │   │   ├── SocketContext.jsx
│   │   │   └── CaptainContext.jsx
│   │   ├── pages
│   │   │   ├── CaptainHome.jsx
│   │   │   ├── CaptainRideHistory.jsx
│   │   │   ├── CaptainWallet.jsx
│   │   │   ├── RideHistory.jsx
│   │   │   ├── RideDetails.jsx
│   │   │   └── ...
│   │   ├── services
│   │   │   └── dashboardService.js
│   │   ├── App.jsx
│   │   └── main.jsx
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
- Ride History (User & Captain)
- Captain Wallet / Earnings
- Payment
- OTP Verification
- Maps & Geolocation

## Ride Endpoints

| Method | Endpoint                | Auth    | Description                                              |
| ------ | ------------------------ | ------- | ---------------------------------------------------------- |
| POST   | `/rides/create`          | User    | Create a new ride and notify nearby captains               |
| GET    | `/rides/get-fare`        | User    | Estimate fare for a pickup/destination pair                |
| POST   | `/rides/confirm`         | Captain | Accept a pending ride                                      |
| POST   | `/rides/start`           | Captain | Start a ride after OTP verification                        |
| POST   | `/rides/end`             | Captain | Mark a ride completed                                      |
| GET    | `/rides/history`         | User    | Rider's own ride history                                   |
| GET    | `/rides/captain-history` | Captain | Captain's ride history — `status` and `range` filters      |
| GET    | `/rides/captain-wallet`  | Captain | Balance, earnings summary, chart, transactions — `range`, `startDate`, `endDate` filters |
| GET    | `/rides/repeat/:rideId`  | User    | Re-fetch fare/details to repeat a past ride                 |
| GET    | `/rides/:rideId`         | User    | Single ride details                                         |

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

# 🔮 Future Improvements

- Live Driver Tracking
- Ratings & Reviews
- Push Notifications
- Scheduled Rides
- Multiple Payment Methods
- Captain Payout / Withdrawal Flow (balance is currently display-only)
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
- Data Visualization (custom SVG charts)
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
