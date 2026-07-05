import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

/**
 * Protected wrapper component for user-only routes
 * Redirects to login if user is not authenticated
 */
const UserProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { setUser } = useContext(UserDataContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            if (response.status === 200) {
                // FIX: the backend's getUserProfile controller does
                // res.status(200).json(req.user) — it returns the user
                // object directly, NOT wrapped as { user: ... } (unlike
                // the captain equivalent, which wraps it as
                // { captain: req.captain }). The old code here called
                // setUser(response.data.user), which was always undefined,
                // so every page load silently wiped the user context.
                // That permanently broke the socket 'join' event in
                // Home.jsx, since its guard `if (!user || !user._id) return`
                // never let the join fire — the user's socketId in Mongo
                // was never set, so the backend had nowhere to deliver
                // 'ride-confirmed', causing "Looking for a Driver" to hang
                // forever no matter how many times the socket reconnected.
                setUser(response.data)
            }
        })
        .catch((error) => {
            console.log(error)
            localStorage.removeItem('token')
            navigate('/login')
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, [token, navigate, setUser])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper