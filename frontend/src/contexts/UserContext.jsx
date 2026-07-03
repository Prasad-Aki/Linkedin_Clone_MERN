import React, { useContext, useEffect } from "react"
import { AuthDatacontext } from "./Authcontext"
import axios from 'axios'
import { createContext } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export const userDataContext = createContext()

function UserContext({ children }) {
    const [UserData, SetUserData] = useState(null)
    const { serverurl } = useContext(AuthDatacontext)
    const [edit, Setedit] = useState(false)
    const [postData, SetpostData] = useState([])
    const [profileData, SetprofileData] = useState(null)
    let navigate = useNavigate()

    const getcurrentuser = async () => {
        try {
            const result = await axios.get(serverurl + "/api/user/currentuser", { withCredentials: true })
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

            SetpostData(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handlegetProfile = async (userName) => {
        try {
            const result = await axios.get(serverurl + `/api/user/profile/${userName}`, { withCredentials: true })
            SetprofileData(result.data)
            console.log(result.data)
            navigate(`/profile/${userName}`)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getcurrentuser()
        getpostData()
    }, [])

    const value = { UserData, SetUserData, edit, Setedit, postData, SetpostData, getpostData, handlegetProfile, profileData, getcurrentuser }
    return (
        <>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>
        </>
    )
}

export default UserContext