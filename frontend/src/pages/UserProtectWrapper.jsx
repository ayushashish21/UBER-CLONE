import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

/**
 * Protected wrapper component for user-only routes
 * Redirects to login if user is not authenticated
 */
const UserProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    if (!token) {
        navigate('/login')
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper
