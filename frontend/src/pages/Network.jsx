import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { AuthDatacontext } from "../contexts/Authcontext"
import axios from "axios"

function Network() {
    let serverurl = useContext(AuthDatacontext)
    let [connections, Setconnections] = useState([])

    const handleGetRequest = async () => {
        console.log("🔥 FUNCTION CALLED");   // 👈 ADD THIS

        try {
            const res = await axios.get(`${serverurl}/api/connection/requests`, {
                withCredentials: true
            })
            console.log("API RESPONSE:", res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
          console.log("🔥 useEffect running");
        handleGetRequest()
    }, [])

    return (
        <div className="w-screen h-[100vh] bg-[#f0efe7] pt-[100px]">
            <Navbar />
            <div className="w-full  h-[100px]">
                Invitations - {connections.length}
            </div>
        </div>

    )
}

export default Network