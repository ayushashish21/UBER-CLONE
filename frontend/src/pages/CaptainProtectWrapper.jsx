import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useCaptainContext } from '../context/CaptainContext.jsx'
import { useNavigate } from 'react-router-dom'

/**
 * Protected wrapper component for captain-only routes
 * Redirects to login if captain is not authenticated
 */
const CaptainProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { setCaptain } = useCaptainContext()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/captain-login')
            return
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            if (response.status === 200) {
                setCaptain(response.data.captain)
                setIsLoading(false)
            }
        })
        .catch((error) => {
            console.log(error)
            localStorage.removeItem('token')
            navigate('/captain-login')
        })
    }, [token, navigate, setCaptain])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectWrapper
