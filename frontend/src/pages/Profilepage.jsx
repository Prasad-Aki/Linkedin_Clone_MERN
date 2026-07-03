import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { userDataContext } from "../contexts/UserContext"
import { FaPencilAlt } from "react-icons/fa"
import { IoCameraOutline } from "react-icons/io5"
import { AuthDatacontext } from "../contexts/Authcontext"
import axios from "axios"
import EditProfile from "../components/EditProfile"
import Post from "../components/Post.jsx"
import ConnectionBtn from "../components/ConnectionBtn.jsx"
import { useParams } from "react-router-dom"

function Profilepage() {
    const { UserData, SetUserData, edit, Setedit, postData, SetpostData } = useContext(userDataContext)
    const { userName } = useParams()
    const [userConnection, SetuserConnection] = useState([])
    const [profilePost, SetprofilePost] = useState([])
    const [viewedUser, SetviewedUser] = useState(null)
    const [loading, Setloading] = useState(true)
    let { serverurl } = useContext(AuthDatacontext)

    const isOwnProfile = !userName || userName === UserData?.userName

    const handleGetUserConnection = async () => {
        try {
            let result = await axios.get(`${serverurl}/api/connection`, { withCredentials: true })
            SetuserConnection(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (isOwnProfile) {
            handleGetUserConnection()
        }
    }, [isOwnProfile])

    useEffect(() => {
        const fetchUserData = async () => {
            if (isOwnProfile) {
                SetviewedUser(UserData)
                Setloading(false)
            } else {
                Setloading(true)
                try {
                    const result = await axios.get(`${serverurl}/api/user/profile/${userName}`, { withCredentials: true })
                    SetviewedUser(result.data)
                } catch (error) {
                    console.error("Error fetching profile details:", error)
                } finally {
                    Setloading(false)
                }
            }
        }
        fetchUserData()
    }, [userName, UserData, isOwnProfile, serverurl])

    useEffect(() => {
        if (viewedUser) {
            SetprofilePost(postData.filter((post) => post.author._id == viewedUser._id))
        }
    }, [postData, viewedUser])

    if (loading || !viewedUser) {
        return (
            <div className="w-full min-h-[100vh] pt-[100px] bg-[#f0efe7] flex flex-col items-center">
                <Navbar />
                <div className="w-full max-w-[900px] flex flex-col gap-4 mt-5 p-4 bg-white rounded-lg shadow-lg animate-pulse">
                    <div className="w-full h-[200px] bg-gray-300 rounded-md"></div>
                    <div className="w-[100px] h-[100px] bg-gray-300 rounded-full -mt-[50px] ml-7 border-4 border-white"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4 mt-4 ml-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mt-2 ml-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mt-2 ml-4 mb-4"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-[100vh] pt-[100px] bg-[#f0efe7] flex flex-col items-center">
            <Navbar />
            {edit && isOwnProfile && <EditProfile />}
            <div className="w-full max-w-[900px] min-h-[100vh] flex flex-col mb-[40px] gap-[20px]">
                <div className="relative bg-white pb-[40px] rounded-lg shadow-lg">
                    <div 
                        onClick={() => { if (isOwnProfile) Setedit(true) }} 
                        className={`w-[100%] h-[200px] bg-gray-500 overflow-hidden flex items-start relative ${isOwnProfile ? "cursor-pointer" : ""} items-center justify-center`}
                    >
                        <img src={viewedUser.coverImage || ""} alt="" className="w-full h-full object-cover" />
                        {isOwnProfile && <IoCameraOutline className="absolute right-[20px] top-[20px] w-[25px] h-[25px] cursor-pointer text-white" />}
                    </div>
                    <div 
                        onClick={() => { if (isOwnProfile) Setedit(true) }} 
                        className={`flex justify-start absolute ml-7 ${isOwnProfile ? "cursor-pointer" : ""}`}
                    >
                        <img className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white -mt-[45px]" src={viewedUser.profileImage} alt="" />
                    </div>
                    <div className="mt-[46px] pl-[20px] text-[22px] font-bold text-gray-700"> {viewedUser?.firstName} {viewedUser?.lastName}</div>
                    <div className="pl-[20px] text-[18px] text-gray-600 font-semibold">{viewedUser.headline}</div>
                    <div className="pl-[20px] text-[15px] text-gray-500">{viewedUser.location}</div>
                    <div className="pl-[20px] text-[16px] font-semibold text-[#0A66C2]">
                        {`${isOwnProfile ? userConnection.length : (viewedUser.connection ? viewedUser.connection.length : 0)} connections`}
                    </div>
                    
                    {isOwnProfile ? (
                        <button className="w-[150px] h-[40px] mt-[10px] my-[20px] ml-[20px] flex items-center justify-center gap-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] cursor-pointer" onClick={() => { Setedit(true) }}>
                            Edit Profile <FaPencilAlt />
                        </button>
                    ) : (
                        <div className="ml-[20px] mt-[10px] my-[20px] w-[180px]">
                            <ConnectionBtn userId={viewedUser._id} />
                        </div>
                    )}
                </div>

                <div className="w-full h-[100px] bg-white rounded-lg shadow-lg flex items-center p-[20px] text-[22px] text-gray-600 font-semibold">
                    {`Posts (${profilePost.length})`}
                </div>
                {profilePost.map((post) => (
                    <Post key={post._id}
                        id={post._id}
                        image={post.image}
                        description={post.description}
                        author={post.author}
                        like={post.like}
                        comment={post.comment} />
                ))}

                {viewedUser.skills && viewedUser.skills.length > 0 && (
                    <div className="w-full flex flex-col gap-3 bg-white rounded-lg shadow-lg p-5 font-semibold">
                        <div className="text-[22px] text-gray-600">Skills</div>
                        {viewedUser.skills.map((skill, index) => (
                            <div key={index} className="flex flex-col">
                                <span>{skill}</span>
                                <hr className="border-t border-gray-300 mt-2" />
                            </div>
                        ))}
                    </div>
                )}

                {viewedUser.education && viewedUser.education.length > 0 && (
                    <div className="w-full flex flex-col gap-3 bg-white rounded-lg shadow-lg p-5 font-semibold">
                        <div className="text-[22px] text-gray-600">Education</div>
                        {viewedUser.education.map((edu, index) => (
                            <div key={index} className="flex flex-col">
                                <span className=""><span className="text-gray-600">College : </span>{edu.college}</span>
                                <span className=""><span className="text-gray-600">Degree : </span>{edu.degree}</span>
                                <span className=""><span className="text-gray-600">Field Of Study : </span>{edu.fieldOfStudy}</span>
                                <hr className="border-t border-gray-300 mt-2" />
                            </div>
                        ))}
                    </div>
                )}

                {viewedUser.experience && viewedUser.experience.length > 0 && (
                    <div className="w-full flex flex-col gap-3 bg-white rounded-lg shadow-lg p-5 font-semibold">
                        <div className="text-[22px] text-gray-600">Experience</div>
                        {viewedUser.experience.map((exp, index) => (
                            <div key={index} className="flex flex-col">
                                <span className=""><span className="text-gray-600">Title : </span>{exp.title}</span>
                                <span className=""><span className="text-gray-600">Company : </span>{exp.company}</span>
                                <span className=""><span className="text-gray-600">Description : </span>{exp.description}</span>
                                <hr className="border-t border-gray-300 mt-2" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profilepage