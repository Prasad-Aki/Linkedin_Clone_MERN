import react, { useContext, useState } from "react"
import logo from "../assets/logo.svg"
import { CiSearch } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import profile from "../assets/profile.jpg"
import { userDataContext } from "../contexts/UserContext.jsx";
import { AuthDatacontext } from "../contexts/Authcontext.jsx";
import { useNavigate } from "react-router-dom"
import axios from "axios";

function Navbar() {

    const [activesearch, Setactivesearch] = useState(false)
    const { UserData, SetUserData } = useContext(userDataContext)
    const navigate = useNavigate()
    const { serverurl } = useContext(AuthDatacontext)
    const [popup, Setpopup] = useState(false)

    const handelSignOut = async () => {
        try {
            const result = await axios.post(serverurl + "/api/auth/logout", {}, { withCredentials: true })
            SetUserData(null)
            navigate("/login")
            console.log(result)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="w-full h-[80px] bg-white top-0 fixed shadow-lg flex items-center justify-between md:justify-around px-[10px]">

                <div className="flex justify-center items-center gap-[10px]">
                    <div onClick={() => {
                        Setactivesearch(false)
                    }}>
                        <img src={logo} alt="" />
                    </div>
                    <div ><CiSearch onClick={() => { Setactivesearch(true) }} className="w-[25px] h-[25px] text-gray-700 lg:hidden" /></div>
                    <form className={` w-[200px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${!activesearch ? "hidden" : "flex"}`}>
                        <div ><CiSearch className="w-[25px] h-[25px] text-gray-700" /></div>
                        <input type="text" name="" id="" placeholder="Search" className="w-[80%] bg-transparent outline-none" />
                    </form>
                </div>

                <div className="flex items-center justify-center gap-[20px] relative">

                    {popup && <div className="w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] rounded-lg flex flex-col items-center p-[20px] gap-[15px]">
                        <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                            <img className="w-full h-full" src={profile} alt="" />
                        </div>
                        <div className="text-[18px] font-semibold text-gray-700">
                            {UserData?.firstName} {UserData?.lastName}
                        </div>
                        <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] cursor-pointer">View Profile</button>
                        <div className="w-full h-[1px] bg-gray-700"></div>
                        <div className="flex items-center justify-start w-full text-gray-600 gap-[10px]">
                            <div><FaUserGroup className="w-[23px] h-[23px]" /></div>
                            <div>My Network</div>
                        </div>
                        <button onClick={handelSignOut} className="w-[100%] h-[40px] rounded-full border-2 border-[#ff2d2d] text-[#ff2d2d] cursor-pointer">Sign Out</button>
                    </div>}

                    <div className="lg:flex hidden flex-col items-center justify-center text-gray-600">
                        <div><FaHome className="w-[23px] h-[23px]" /></div>
                        <div>Home</div>
                    </div>

                    <div className="lg:flex hidden flex-col items-center justify-center text-gray-600">
                        <div><FaUserGroup className="w-[23px] h-[23px]" /></div>
                        <div>My Network</div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-gray-600">
                        <div><IoMdNotifications className="w-[23px] h-[23px] " /></div>
                        <div className="hidden md:block">Notifications</div>
                    </div>

                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                        <img onClick={() => {
                            Setpopup(prev => !prev)
                        }} className="w-full h-full cursor-pointer" src={profile} alt="" />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Navbar