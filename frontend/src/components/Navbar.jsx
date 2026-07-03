import react, { useContext, useState, useEffect } from "react"
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
import Network from "../pages/Network.jsx";
import { io } from "socket.io-client";
import moment from "moment";

const socket = io("http://localhost:3000");

function Navbar() {

    const [activesearch, Setactivesearch] = useState(false)
    const { UserData, SetUserData, handlegetProfile } = useContext(userDataContext)
    const navigate = useNavigate()
    const { serverurl } = useContext(AuthDatacontext)
    const [popup, Setpopup] = useState(false)
    const [searchQuery, SetsearchQuery] = useState("")
    const [searchResults, SetsearchResults] = useState([])
    const [showSearchDropdown, SetshowSearchDropdown] = useState(false)
    const [notifications, Setnotifications] = useState([])
    const [showNotifications, SetshowNotifications] = useState(false)

    const fetchNotifications = async () => {
        try {
            const result = await axios.get(`${serverurl}/api/notification`, { withCredentials: true })
            Setnotifications(result.data)
        } catch (error) {
            console.log("Error fetching notifications:", error)
        }
    }

    useEffect(() => {
        if (UserData?._id) {
            socket.emit("register", UserData._id)
            fetchNotifications()
        }

        const handleNewNotification = (notif) => {
            Setnotifications(prev => [notif, ...prev])
        }

        socket.on("newNotification", handleNewNotification)

        return () => {
            socket.off("newNotification", handleNewNotification)
        }
    }, [serverurl, UserData?._id])

    const handleNotificationClick = async () => {
        SetshowNotifications(prev => !prev)
        Setpopup(false)
        if (!showNotifications) {
            try {
                await axios.put(`${serverurl}/api/notification/read`, {}, { withCredentials: true })
                Setnotifications(prev => prev.map(n => ({ ...n, read: true })))
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleSearchChange = async (e) => {
        const val = e.target.value
        SetsearchQuery(val)
        if (val.trim()) {
            try {
                const result = await axios.get(`${serverurl}/api/user/search?query=${val}`, { withCredentials: true })
                SetsearchResults(result.data)
                SetshowSearchDropdown(true)
            } catch (error) {
                console.log("Search error:", error)
            }
        } else {
            SetsearchResults([])
            SetshowSearchDropdown(false)
        }
    }

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
            <div className="w-full h-[80px] bg-white top-0 left-0 z-[80] fixed shadow-lg flex items-center justify-between md:justify-around px-[10px]">

                <div className="flex justify-center items-center gap-[10px] relative">
                    <div onClick={() => {
                        Setactivesearch(false)
                        SetshowSearchDropdown(false)
                    }}>
                        <img src={logo} alt="" className="cursor-pointer" onClick={() => {navigate("/")}}/>
                    </div>
                    <div ><CiSearch onClick={() => { Setactivesearch(true) }} className="w-[25px] h-[25px] text-gray-700 lg:hidden" /></div>
                    <form onSubmit={(e) => e.preventDefault()} className={` w-[200px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${!activesearch ? "hidden" : "flex"}`}>
                        <div ><CiSearch className="w-[25px] h-[25px] text-gray-700" /></div>
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="w-[80%] bg-transparent outline-none" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => { if (searchQuery.trim()) SetshowSearchDropdown(true) }}
                        />
                    </form>

                    {showSearchDropdown && searchResults.length > 0 && (
                        <div className="absolute top-[60px] left-[10px] lg:left-[55px] w-[250px] lg:w-[350px] bg-white border border-gray-200 rounded-md shadow-lg z-[100] max-h-[300px] overflow-y-auto">
                            {searchResults.map((user) => (
                                <div 
                                    key={user._id} 
                                    className="flex items-center gap-[10px] p-[10px] hover:bg-gray-100 cursor-pointer border-b last:border-0"
                                    onClick={() => {
                                        handlegetProfile(user.userName)
                                        SetsearchQuery("")
                                        SetshowSearchDropdown(false)
                                    }}
                                >
                                    <div className="w-[35px] h-[35px] rounded-full overflow-hidden flex items-center justify-center">
                                        <img src={user.profileImage || profile} className="h-full w-full object-cover" alt="" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[14px] font-semibold text-gray-700">{user.firstName} {user.lastName}</span>
                                        <span className="text-[11px] text-gray-400 -mt-[2px]">{user.headline || `@${user.userName}`}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center gap-[20px] relative">

                    {popup && <div className="w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] rounded-lg flex justify-center flex-col items-center p-[20px] gap-[15px]">
                        <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                            <img className="w-full h-full" src={UserData.profileImage || profile} alt="" />
                        </div>
                        <div className="text-[18px] font-semibold text-gray-700">
                            {UserData?.firstName} {UserData?.lastName}
                        </div>
                        <button onClick={() => {navigate(`/profile/${UserData.userName}`)}} className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] cursor-pointer">View Profile</button>
                        <div className="w-full h-[1px] bg-gray-700"></div>
                        <div className="flex items-center justify-start w-full text-gray-600 gap-[10px]">
                            <div><FaUserGroup className="w-[23px] h-[23px]" /></div>
                            <div className="cursor-pointer" onClick={() => navigate("/network")}>My Network</div>
                        </div>
                        <button onClick={handelSignOut} className="w-[100%] h-[40px] rounded-full border-2 border-[#ff2d2d] text-[#ff2d2d] cursor-pointer">Sign Out</button>
                    </div>}

                    <div onClick={() => navigate("/")} className="lg:flex hidden cursor-pointer flex-col items-center justify-center text-gray-600">
                        <div><FaHome className="w-[23px] h-[23px]" /></div>
                        <div>Home</div>
                    </div>

                    <div onClick={() => navigate("/network")} className="lg:flex hidden cursor-pointer flex-col items-center justify-center text-gray-600">
                        <div><FaUserGroup className="w-[23px] h-[23px]" /></div>
                        <div>My Network</div>
                    </div>

                    <div className="relative cursor-pointer flex flex-col items-center justify-center text-gray-600" onClick={handleNotificationClick}>
                        <div className="relative">
                            <IoMdNotifications className="w-[23px] h-[23px]" />
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[9px] w-[14px] h-[14px] flex items-center justify-center font-bold">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </div>
                        <div className="hidden md:block">Notifications</div>
                    </div>

                    {showNotifications && (
                        <div className="w-[320px] max-h-[400px] overflow-y-auto bg-white shadow-xl absolute top-[75px] right-[40px] rounded-lg flex flex-col p-[15px] gap-[10px] border border-gray-100 z-[90]">
                            <div className="font-semibold text-gray-700 border-b pb-[8px] text-[16px] text-left">Notifications</div>
                            {notifications.length === 0 ? (
                                <div className="text-[14px] text-gray-400 text-center py-6">No notifications yet</div>
                            ) : (
                                <div className="flex flex-col gap-[10px]">
                                    {notifications.map((notif) => (
                                        <div 
                                            key={notif._id} 
                                            className={`flex items-start gap-[10px] p-[8px] rounded-md hover:bg-gray-50 cursor-pointer ${!notif.read ? "bg-blue-50/50" : ""}`}
                                            onClick={() => {
                                                if (notif.postRef) {
                                                    navigate("/")
                                                } else {
                                                    navigate("/network")
                                                }
                                                SetshowNotifications(false)
                                            }}
                                        >
                                            <div className="w-[35px] h-[35px] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                                                <img src={notif.sender?.profileImage || profile} className="h-full w-full object-cover" alt="" />
                                            </div>
                                            <div className="flex flex-col text-left text-[12px] text-gray-700">
                                                <span>
                                                    <span className="font-semibold">{notif.sender?.firstName} {notif.sender?.lastName}</span>
                                                    {notif.type === "like" && " liked your post."}
                                                    {notif.type === "comment" && " commented on your post."}
                                                    {notif.type === "connection_request" && " sent you a connection request."}
                                                    {notif.type === "connection_accept" && " accepted your connection request."}
                                                </span>
                                                <span className="text-[10px] text-gray-400 mt-[3px]">{moment(notif.createdAt).fromNow()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                        <img onClick={() => {
                            Setpopup(prev => !prev)
                            SetshowNotifications(false)
                        }} className="w-full h-full cursor-pointer" src={UserData.profileImage || profile} alt="" />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Navbar