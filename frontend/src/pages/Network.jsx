import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { AuthDatacontext } from "../contexts/Authcontext"
import axios from "axios"
import profile from "../assets/profile.jpg"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";

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

    const handleAcceptRequest = async (requestId) => {
        try {
            let result = await axios.put(`${serverurl}/api/connection/accept/${requestId}`, {}, { withCredentials: true })
            console.log()
        } catch (error) {
            console.log(error)
        }
    }

    const handleRejecttRequest = async (requestId) => {
        try {
            let result = await axios.put(`${serverurl}/api/connection/reject/${requestId}`, {}, { withCredentials: true })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetRequest()
    }, [])

    return (
        <div className="w-screen h-[100vh] items-center bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col gap-[10px]">
            <Navbar />
            <div className="w-full bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600 h-[100px]">
                Invitations - {connections.length}
            </div>
            {connections.length > 0 &&
                <div className="w-[100%] max-w-[900px]  flex flex-col gap-[20px] min-h-[100px]">
                    {connections.map((conn, idx) => (
                        <div className="flex w-full bg-white min-h-[100px] p-[20px] justify-between items-center rounded-lg shadow-md">
                            <div className="flex items-center justify-center gap-[10px]">
                                <div className="w-[60px] h-[60px]  rounded-full cursor-pointer overflow-hidden">
                                    <img className="w-full h-full" src={conn.sender.profileImage || profile} alt="" />
                                </div>
                                <div className="flex" key={idx}>{conn.sender.firstName} {conn.sender.lastName}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="text-[#18c5ff] font-semibold cursor-pointer" onClick={() => { handleAcceptRequest(conn._id) }}><IoIosCheckmarkCircleOutline className="w-[40px] h-[40px]" /></button>
                                <button className="text-[#ff4218] font-semibold cursor-pointer" onClick={() => { handleRejecttRequest(conn._id) }}><RxCrossCircled className="w-[37px] h-[37px]" /></button>
                            </div>
                        </div>

                    ))}
                </div>
            }


        </div>

    )
}

export default Network