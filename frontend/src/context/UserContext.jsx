import React, { createContext, useState } from 'react'

/**
 * User Data Context
 * Provides user data and setUser function to all components
 */
export const UserDataContext = createContext();

/**
 * UserContext Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const UserContext = ({ children }) => {
    const [user, setUser] = useState({
        email: '',
        fullname: {
            firstname: '',
            lastname: ''
        }
    });

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    );
}

export default UserContext
