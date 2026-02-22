import React, { useContext, useEffect } from "react"
import { AuthDatacontext } from "./Authcontext"
import axios from 'axios'
import { createContext } from "react"
import { useState } from "react"
export const userDataContext = createContext()

function UserContext({ children }) {
    const [UserData, SetUserData] = useState(null)
    const { serverurl } = useContext(AuthDatacontext)
    const [edit, Setedit] = useState(false)
    const [postData, SetpostData] = useState([])

    const getcurrentuser = async () => {
        try {
            const result = await axios.get(serverurl + "/api/user/currentuser", { withCredentials: true })
            console.log(result)
            SetUserData(result.data.user)
        } catch (error) {
            console.log("STATUS:", error.response?.status)
            console.log("MESSAGE:", error.response?.data)
            SetUserData(null)
        }
    }

    const getpostData = async () => {
        try {
            const result = await axios.get(serverurl + "/api/post/all", { withCredentials: true })
            console.log(result)
            
            SetpostData(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getcurrentuser()
        getpostData()
    }, [])

    const value = { UserData, SetUserData, edit, Setedit, postData, SetpostData }
    return (
        <>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </>
    )
}

export default UserContext