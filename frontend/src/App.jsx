import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import Payment from './pages/Payment'
import RideHistory from "./pages/RideHistory";
import RideDetails from "./pages/RideDetails";

/**
 * Main App Component
 * Defines all routes for the application
 */
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/captain-riding" element={<CaptainRiding />} />

        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<Captainlogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/rides/:rideId" element={<RideDetails />} />
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          }
        />

        {/* ADDED: payment screen, gated behind UserProtectWrapper since
            Payment.jsx calls /payments/create-order and /payments/verify,
            both of which require authMiddleware.authUser on the backend. */}
        <Route
          path="/payment"
          element={
            <UserProtectWrapper>
              <Payment />
            </UserProtectWrapper>
          }
        />

        <Route
          path="/ride-history"
          element={
            <UserProtectWrapper>
              <RideHistory />
            </UserProtectWrapper>
          }
        />

        <Route path='/user/logout' element={<UserProtectWrapper>
          <UserLogout />
        </UserProtectWrapper>
        } />

        <Route path="/captain-home" element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>
        } />

        <Route path="/captain/logout" element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        } />

      </Routes>
    </div>
  )
}

export default App