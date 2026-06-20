import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

/**
 * CaptainLogout Component
 * Handles captain logout by calling the logout API and redirecting to captain login page
 */
const CaptainLogout = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/captains/logout`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (response.status === 200) {
                    localStorage.removeItem('token')
                    navigate('/captain-login')
                }
            } catch (error) {
                console.error('Captain logout error:', error)
                localStorage.removeItem('token')
                navigate('/captain-login')
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

export default CaptainLogout
