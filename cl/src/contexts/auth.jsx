import React, { createContext, useState } from 'react'

export const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState(null);
    const [idTransToEdit, setTransToEdit ] = useState('');

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
                logout,
                idTransToEdit,
                setTransToEdit
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
