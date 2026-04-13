import react, { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { userDataContext } from "../contexts/UserContext"
import { FaPencilAlt } from "react-icons/fa"
import { IoCameraOutline } from "react-icons/io5"
import { AuthDatacontext } from "../contexts/Authcontext"
import axios from "axios"
import EditProfile from "../components/EditProfile"


function Profilepage() {
    const { UserData, SetUserData, edit, Setedit, postData, SetpostData } = useContext(userDataContext)
    const [userConnection, SetuserConnection] = useState([])
    let { serverurl } = useContext(AuthDatacontext)

    const handleGetUserConnection = async () => {
        try {
            let result = await axios.get(`${serverurl}/api/connection`, { withCredentials: true })
            SetuserConnection(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetUserConnection()
    }, [])

    return (

        <div className="w-full min-h-[100vh] pt-[100px] bg-[#f0efe7] flex flex-col items-center">
            <Navbar />
            {edit && <EditProfile />}
            <div className="w-full  max-w-[900px] min-h-[100vh]">
                <div className="relative bg-white pb-[40px] rounded-lg shadow-lg">
                    <div onClick={() => { Setedit(true) }} className="w-[100%] h-[200px] bg-gray-500 overflow-hidden flex items-start relative cursor-pointer items-center justify-center">
                        <img src={UserData.coverImage || ""} alt="" className="w-full h-full object-cover" />
                        <IoCameraOutline className="absolute right-[20px] top-[20px] w-[25px] h-[25px] cursor-pointer text-white" />
                    </div>
                    <div onClick={() => { Setedit(true) }} className=" flex justify-start absolute ml-7 cursor-pointer">
                        <img className="w-[90px] h-[90px] rounded-full overflow-hidden 
                                     border-4 border-white -mt-[45px] cursor-pointer" src={UserData.profileImage || profile} alt="" />
                    </div>
                    <div className="mt-[46px] pl-[20px] text-[22px] font-bold text-gray-700"> {UserData?.firstName} {UserData?.lastName}</div>
                    <div className=" pl-[20px] text-[18px]  text-gray-600 font-semibold">{UserData.headline}</div>
                    <div className=" pl-[20px] text-[15px]  text-gray-500">{UserData.location}</div>
                    <div className=" pl-[20px] text-[16px] font-semibold text-[#0A66C2]">{`${userConnection.length} connection`}</div>
                    <button className="w-[150px] h-[40px] mt-[10px] my-[20px] ml-[20px] flex items-center justify-center gap-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] cursor-pointer" onClick={() => { Setedit(true) }}>Edit Profile <FaPencilAlt />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profilepage