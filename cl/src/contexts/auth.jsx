import React, { createContext, useState } from 'react'

export const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState(null)

    const login = (user) => {
        setLoggedUser(user)
    }

    const logout = (user) => {
        setLoggedUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                loggedUser,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
