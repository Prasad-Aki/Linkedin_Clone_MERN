import React, { useContext, useEffect, useState } from "react"
import { AuthDatacontext } from "../contexts/Authcontext.jsx"
import axios from "axios"
import io from "socket.io-client"
import { userDataContext } from "../contexts/UserContext.jsx"
import { useNavigate } from "react-router-dom"

const socket = io("http://localhost:3000")

const ConnectionBtn = ({ userId }) => {
    let navigate = useNavigate()

    const { serverurl } = useContext(AuthDatacontext)
    const { UserData } = useContext(userDataContext)

    const [status, Setstatus] = useState("connect")

    const handelsendBtn = async () => {
        try {
            const result = await axios.post(`${serverurl}/api/connection/send/${userId}`, {}, { withCredentials: true })
        } catch (error) {
            console.log(error)
        }
    }

    const handelremoveBtn = async () => {
        try {
            
            const result = await axios.delete(`${serverurl}/api/connection/remove/${userId}`, {}, { withCredentials: true })
        } catch (error) {
            console.log(error)
        }
    }

    const handelGetStatus = async () => {
        try {
            const result = await axios.get(
                `${serverurl}/api/connection/getstatus/${userId}`,
                { withCredentials: true }
            )
            Setstatus(result.data.status)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        socket.emit("register", UserData._id)
        handelGetStatus()

        socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {
            if (updatedUserId == userId) {
                Setstatus(newStatus)
            }
        })

    }, [UserData._id])

    const handelClick = async () => {
        if (status == "disconnect") {
            await handelremoveBtn()
        } else if (status == "received") {
            navigate("/network")
        } else {
            await handelsendBtn()
        }
    }

    return (
        <div>
            <button onClick={handelClick} disabled={status=="pending"} className="min-w-[100px] h-[40px] rounded-full border-2 text-[#0ccdf4] cursor-pointer">
                {status}
            </button>
        </div>
    )
}

export default ConnectionBtn