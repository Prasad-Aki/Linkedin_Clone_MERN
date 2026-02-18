import React, { useContext, useState } from "react"
import Navbar from "../components/Navbar.jsx"
import profile from "../assets/profile.jpg"
import { FaPlus } from "react-icons/fa"
import { IoCameraOutline } from "react-icons/io5"
import { userDataContext } from "../contexts/UserContext.jsx"
import { FaPencilAlt } from "react-icons/fa"
import EditProfile from "../components/EditProfile.jsx"

function Home() {
    const { UserData, SetUserData, edit, Setedit } = useContext(userDataContext)

    return (
        <>
            <div  className="w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-start justify-center px-[20px] lg:flex-row flex-col gap-[20px]">
                {edit && <EditProfile />}
                <Navbar />

                <div className="lg:w-[25%] w-full min-h-[200px] bg-white shadow-lg rounded-lg  p-[10px]">
                    <div onClick={() => { Setedit(true) }} className="w-[100%] h-[100px] bg-gray-500 overflow-hidden flex items-start relative cursor-pointer items-center justify-center">
                        <img src={UserData.coverImage || ""} alt="" className="w-full h-full object-cover" />
                        <IoCameraOutline className="absolute right-[20px] top-[20px] w-[25px] h-[25px] cursor-pointer text-white" />
                    </div>
                    <div onClick={() => { Setedit(true) }} className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[180px] cursor-pointer left-[117px]">
                        <img className="h-full" src={UserData.profileImage || profile} alt="" />
                    </div>
                    <div className="w-[20px] h-[20px] cursor-pointer bg-[#17c1ff] absolute text-white top-[207px] left-[165px] rounded-full flex justify-center items-center"><FaPlus /></div>
                    <div className="mt-[46px] pl-[20px] text-[18px] font-semibold text-gray-700"> {UserData?.firstName} {UserData?.lastName}</div>
                    <div className=" pl-[20px] text-[15px]  text-gray-500">{UserData.location}</div>
                    <button className="w-[100%] h-[40px] mt-[10px] my-[20px] flex items-center justify-center gap-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] cursor-pointer" onClick={() => { Setedit(true) }}>Edit Profile <FaPencilAlt />
                    </button>
                </div>

                <div className="lg:w-[40%] w-full min-h-[200px] bg-white shadow-lg">

                </div>

                <div className="lg:w-[25%] w-full min-h-[200px] bg-white shadow-lg">

                </div>

            </div>
        </>
    )
}

export default Home