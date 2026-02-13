import React, { createContext } from "react"

export const AuthDatacontext = createContext()
function Authcontext({ children }) {
    const serverurl = "http://localhost:3000"
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