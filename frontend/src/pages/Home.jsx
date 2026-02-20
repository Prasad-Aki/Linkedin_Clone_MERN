import React, { useContext, useRef, useState } from "react"
import Navbar from "../components/Navbar.jsx"
import profile from "../assets/profile.jpg"
import { FaPlus } from "react-icons/fa"
import { IoCameraOutline } from "react-icons/io5"
import { userDataContext } from "../contexts/UserContext.jsx"
import { FaPencilAlt } from "react-icons/fa"
import EditProfile from "../components/EditProfile.jsx"
import { ImCross } from "react-icons/im"
import { FaRegImage } from "react-icons/fa6"

function Home() {
    const { UserData, SetUserData, edit, Setedit } = useContext(userDataContext)
    const [discription, Setdescription] = useState("")
    const [frontend, Setfrontend] = useState("")
    const [backend, Setbackend] = useState("")

    const image = useRef()

    function handelPostImage(e) {
        const file = e.target.files[0]
        Setbackend(file)
        Setfrontend(URL.createObjectURL(file))
    }

    return (
        <>
            <div className="w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-start justify-center px-[20px] lg:flex-row flex-col gap-[20px] relative">
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
                    <div className=" pl-[20px] text-[18px]  text-gray-600 font-semibold">{UserData.headline}</div>
                    <div className=" pl-[20px] text-[15px]  text-gray-500">{UserData.location}</div>
                    <button className="w-[100%] h-[40px] mt-[10px] my-[20px] flex items-center justify-center gap-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] cursor-pointer" onClick={() => { Setedit(true) }}>Edit Profile <FaPencilAlt />
                    </button>
                </div>

                <div className="lg:w-[50%] w-full min-h-[200px] shadow-lg">
                    <div className=" w-full h-[120px] rounded-lg flex items-center justify-center bg-white shadow-lg gap-7">
                        <div className="w-[70px] h-[70px] ml-[60px] rounded-full overflow-hidden flex items-center justify-center">
                            <img className="h-full" src={UserData.profileImage || profile} alt="" />
                        </div>
                        <button className="h-[50px] w-[65%] rounded-full border-2  border-2 cursor-pointer flex items-center justify-start px-[20px] hover:bg-gray-200" >Start a Post</button>
                    </div>
                </div>

                <div className="lg:w-[25%] w-full min-h-[200px] bg-white shadow-lg">

                </div>



                <div className="w-full h-full left-0 right-0 bg-black opacity-[0.5] absolute flex items-center justify-center top-0 z-[100px]">
                </div>
                <div className="w-[90%] max-w-[500px] h-[550px] flex flex-col items-start justify-start shadow-lg absolute z-[200] rounded-2xl bg-white">
                    <div className="absolute top-[20px] right-[15px] w-[25px] h-[25px] cursor-pointer "><ImCross className="font-bold text-gray-700" /></div>
                    <div className="flex gap-5 mt-[10px]">
                        <div className="w-[70px] h-[70px] ml-[20px]  rounded-full overflow-hidden flex items-center justify-center">
                            <img className="h-full" src={UserData.profileImage || profile} alt="" />
                        </div>
                        <p className="mt-[20px] text-2xl font-semibold">{UserData.firstName} {UserData.lastName}</p>
                    </div>
                    <textarea placeholder="What do you want to talk about?" className="w-full text-[19px] h-[250px] p-[10px] outline-none border-none mt-[30px] resize-none" value={discription} onChange={(e) => { Setdescription(e.target.value) }}></textarea>
                    <input type="file" hidden ref={image} onChange={handelPostImage} />
                    <div>
                        <img src={frontend || ""} alt="" />
                    </div>
                    <div className="mt-[20px] ml-[20px]"><FaRegImage className="text-[28px] cursor-pointer text-gray-500" onClick={() => { image.current.click() }} /></div>

                    <div className="w-[95%] mt-[25px] border-1 ml-[12px]"></div>
                    <div className="flex  w-full px-[20px] mt-[15px] justify-end items-center ">
                        <button className="mt-[20px] h-[50px] w-[100px]  rounded-full border-2 p-[10px] text-white bg-[#2ddcff] cursor-pointer" >Post</button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Home