import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

const Home = () => {
    const { user } = useContext(UserDataContext);

    return (
        <div className="p-7">
            <h1 className="text-4xl font-bold mb-5">Welcome to Uber</h1>
            <div className="bg-white p-5 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-3">Your Profile</h2>
                {user && (
                    <div>
                        <p className="text-lg">
                            <span className="font-semibold">Name:</span> {user.fullname?.firstname} {user.fullname?.lastname}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold">Email:</span> {user.email}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home

