import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

/**
 * UserLogout Component
 * Handles user logout by calling the logout API and redirecting to login page
 */
const UserLogout = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/logout`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (response.status === 200) {
                    localStorage.removeItem('token')
                    navigate('/login')
                }
            } catch (error) {
                console.error('Logout error:', error)
                // Clear token and redirect even if API call fails
                localStorage.removeItem('token')
                navigate('/login')
            }
        }

        handleLogout()
    }, [navigate, token])

    return (
        <div className="p-7 flex items-center justify-center h-screen">
            <p className="text-lg font-semibold">Logging out...</p>
        </div>
    )
}

export default UserLogout
