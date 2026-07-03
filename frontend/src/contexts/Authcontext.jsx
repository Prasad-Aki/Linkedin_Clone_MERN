import React, { createContext } from "react"

export const AuthDatacontext = createContext()
function Authcontext({ children }) {
    const serverurl = import.meta.env.VITE_API_URL
    const value = {
        serverurl
    }
    return (
        <>
            <AuthDatacontext.Provider value={value}>
                {children}
            </AuthDatacontext.Provider>
        </>
    )
}

export default Authcontext