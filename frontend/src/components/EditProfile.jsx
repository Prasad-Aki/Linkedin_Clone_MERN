import React, { useContext } from "react"
import { ImCross } from "react-icons/im"
import { userDataContext } from "../contexts/UserContext.jsx"
import profile from "../assets/profile.jpg"
import { FaPlus } from "react-icons/fa"
import { IoCameraOutline } from "react-icons/io5"

function EditProfile() {
    const { edit, Setedit } = useContext(userDataContext)
    return (
        <div className="w-full h-[100vh] fixed top-0 z-[100] flex items-center justify-center ">
            <div className="w-full h-full bg-black opacity-[0.5] absolute"></div>
            <div className="w-[90%] max-w-[500px] shadow-lg rounded-lg h-[600px] h-[200px] bg-white absolute p-[10px] z-[200]">
                <div className="absolute top-[10px] left-[470px] w-[25px] h-[25px] cursor-pointer " onClick={() => { Setedit(false) }}><ImCross className="font-bold text-gray-700" /></div>

                <div className="w-full mt-[30px] h-[150px] rounded-lg bg-gray-500">
                    <img src="" className="w-full" alt="" />
                    <IoCameraOutline className="absolute right-[20px] top-[50px] w-[25px] h-[25px] cursor-pointer text-white" />
                </div>
                <div className="w-[80px] h-[80px] ml-[20px] rounded-full overflow-hidden absolute top-[150px]">
                    <img className="w-full h-full" src={profile} alt="" />
                </div>
                <div className="w-[20px] h-[20px] cursor-pointer bg-[#17c1ff] absolute text-white top-[180px] left-[90px] rounded-full flex justify-center items-center"><FaPlus /></div>

                <form className="w-full flex flex-col items-center justify-center bg-amber-100 mt-[50px] gap-[20px]" >
                    <input type="text" name="" id="" placeholder="firstName" className=""/>
                    <input type="text" name="" id="" placeholder="lastName" className=""/>
                    <input type="text" name="" id="" placeholder="userName" className=""/>
                    <input type="email" name="" id="" placeholder="email" className=""/>
                    <input type="text" name="" id="" placeholder="headline" className=""/>
                    <input type="text" name="" id="" placeholder="location" className=""/>
                    <input type="text" name="" id="" placeholder="gender" className=""/>
                </form>
            </div>
        </div>
    )
}

export default EditProfile