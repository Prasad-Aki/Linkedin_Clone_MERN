import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { AuthDatacontext } from "../contexts/Authcontext"
import axios from "axios"
import profile from "../assets/profile.jpg"


function Network() {
    let { serverurl } = useContext(AuthDatacontext)
    let [connections, Setconnections] = useState([])

    const handleGetRequest = async () => {
        try {
            let result = await axios.get(`${serverurl}/api/connection/requests`, { withCredentials: true })
            Setconnections(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetRequest()
    }, [])

    return (
        <div className="w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col gap-[10px]">
            <Navbar />
            <div className="w-full bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600 h-[100px]">
                Invitations - {connections.length}
            </div>
            {connections.length > 0 &&
                <div className="w-full shadow-lg rounded-lg bg-white flex flex-col gap-[20px] min-h-[100px]">
                    {connections.map((conn, idx) => (
                        <div className="flex w-full justify-between items-center h-[50px]">
                            <div className="w-[50px] h-[50px] rounded-full cursor-pointer overflow-hidden">
                                <img className="w-full h-full" src={conn.sender.profileImage ||profile} alt="" />
                            </div>
                            <div key={idx}>{conn.sender.firstName}</div>
                        </div>
                    ))}
                </div>
            }


        </div>

    )
}

export default Network