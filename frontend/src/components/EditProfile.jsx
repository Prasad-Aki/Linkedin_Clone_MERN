import React, { useContext, useState } from "react"
import { ImCross } from "react-icons/im"
import { userDataContext } from "../contexts/UserContext.jsx"
import profile from "../assets/profile.jpg"
import { FaPlus } from "react-icons/fa"
import { IoCameraOutline } from "react-icons/io5"
import { useRef } from "react"
import axios from "axios"
import { AuthDatacontext } from "../contexts/Authcontext.jsx"

function EditProfile() {
    const { edit, Setedit, UserData, SetUserData } = useContext(userDataContext)
    const { serverurl } = useContext(AuthDatacontext)

    const [firstName, SetfirstName] = useState(UserData.firstName || "")
    const [lastName, SetlastName] = useState(UserData.lastName || "")
    const [userName, SetuserName] = useState(UserData.userName || "")
    const [email, Setemail] = useState(UserData.email || "")
    const [headline, Setheadline] = useState(UserData.headline || "")
    const [location, Setlocation] = useState(UserData.location || "")
    const [gender, Setgender] = useState(UserData.gender || "")
    const [skills, Setskills] = useState(UserData.skills || [])
    const [newskills, Setnewskills] = useState("")
    const [education, Seteducation] = useState(UserData.education || [])
    const [neweducation, Setneweducation] = useState(
        {
            college: "",
            degree: "",
            fieldOfStudy: "",
        }
    )
    const [experience, Setexperience] = useState(UserData.experience || [])
    const [newexperience, Setnewexperience] = useState(
        {
            title: "",
            company: "",
            description: "",
        }
    )

    const [frontendProfileImage, SetfrontendProfileImage] = useState(UserData.profileImage || profile)
    const [BackendProfileImage, SetBackendProfileImage] = useState(null)

    const [frontendcoverImage, SetfrontendcoverImage] = useState(UserData.coverImage || null)
    const [BackendcoverImage, SetBackendcoverImage] = useState(null)

    function handleProfileImage(e) {
        const file = e.target.files[0]
        SetBackendProfileImage(file)
        SetfrontendProfileImage(URL.createObjectURL(file))
    }

    function handlecoverImage(e) {
        const file = e.target.files[0]
        SetBackendcoverImage(file)
        SetfrontendcoverImage(URL.createObjectURL(file))
    }

    const profileImage = useRef()
    const coverImage = useRef()

    function AddSkill(e) {
        e.preventDefault()
        if (newskills && !skills.includes(newskills)) {
            Setskills([...skills, newskills])
        }
        Setnewskills("")
    }

    function RemoveSkill(skill) {
        if (skills.includes(skill)) {
            Setskills(skills.filter((s) => s !== skill))
        }
    }

    function AddEducation(e) {
        e.preventDefault()
        if (neweducation.college && neweducation.degree && neweducation.fieldOfStudy) {
            Seteducation([...education, neweducation])
        }
        Setneweducation({
            college: "",
            degree: "",
            fieldOfStudy: "",
        })
    }

    function RemoveEducation(edu) {
        if (education.includes(edu)) {
            Seteducation(education.filter((e) => e !== edu))
        }
    }

    function AddExperience(e) {
        e.preventDefault()
        if (newexperience.title && newexperience.company && newexperience.description) {
            Setexperience([...experience, newexperience])
        }
        Setnewexperience({
            title: "",
            company: "",
            description: "",
        })
    }

    function RemoveExperience(exp) {
        if (experience.includes(exp)) {
            Setexperience(experience.filter((e) => e !== exp))
        }
    }

    const handelSaveProfile = async () => {
        try {
            const formdata = new FormData()
            formdata.append("firstName", firstName)
            formdata.append("lastName", lastName)
            formdata.append("userName", userName)
            formdata.append("headline", headline)
            formdata.append("email", email)
            formdata.append("location", location)
            formdata.append("skills", JSON.stringify(skills))
            formdata.append("education", JSON.stringify(education))
            formdata.append("experience", JSON.stringify(experience))
            if (BackendProfileImage) {
                formdata.append("profileImage", BackendProfileImage)
            }
            if (BackendcoverImage) {
                formdata.append("coverImage", BackendcoverImage)
            }

            const result = await axios.put(
                serverurl + "/api/user/updateprofile",
                formdata,
                { withCredentials: true }
            )

            SetUserData(result.data)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-full h-[100vh] fixed top-0 z-[100] flex items-center justify-center ">

            <input type="file" accept="image/*" hidden ref={profileImage} onChange={handleProfileImage} />
            <input type="file" accept="image/*" hidden ref={coverImage} onChange={handlecoverImage} />

            <div className="w-full h-full bg-black opacity-[0.5] absolute"></div>
            <div className="w-[90%] max-w-[500px] overflow-auto shadow-lg rounded-lg h-[600px] h-[200px] bg-white absolute p-[10px] z-[200]">
                <div className="absolute top-[10px] left-[470px] w-[25px] h-[25px] cursor-pointer " onClick={() => { Setedit(false) }}><ImCross className="font-bold text-gray-700" /></div>

                <div className="w-full mt-[30px] h-[150px] rounded-lg bg-gray-500" onClick={() => { coverImage.current.click() }}>
                    <img src={frontendcoverImage} className="w-full h-full object-cover   " alt="" />
                    <IoCameraOutline className="absolute right-[20px] top-[50px] w-[25px] h-[25px] cursor-pointer text-white" />
                </div>
                <div className="w-[80px] h-[80px] ml-[20px] rounded-full overflow-hidden absolute top-[150px]" onClick={() => { profileImage.current.click() }}>
                    <img className="w-full h-full" src={frontendProfileImage} alt="" />
                </div>
                <div className="w-[20px] h-[20px] cursor-pointer bg-[#17c1ff] absolute text-white top-[180px] left-[90px] rounded-full flex justify-center items-center"><FaPlus /></div>

                <div className="w-full flex flex-col items-center justify-center mt-[50px] gap-[20px]" >
                    <input type="text" name="" id="" placeholder="firstName" className="w-full h-[50px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" value={firstName} onChange={(e) => { SetfirstName(e.target.value) }} />
                    <input type="text" name="" id="" placeholder="lastName" className="w-full h-[50px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" value={lastName} onChange={(e) => { SetlastName(e.target.value) }} />
                    <input type="text" name="" id="" placeholder="userName" className="w-full h-[50px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" value={userName} onChange={(e) => { SetuserName(e.target.value) }} />
                    <input type="email" name="" id="" placeholder="email" className="w-full h-[50px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" value={email} onChange={(e) => { Setemail(e.target.value) }} />
                    <input type="text" name="" id="" placeholder="headline" className="w-full h-[50px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" value={headline} onChange={(e) => { Setheadline(e.target.value) }} />
                    <input type="text" name="" id="" placeholder="location" className="w-full h-[50px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" value={location} onChange={(e) => { Setlocation(e.target.value) }} />
                    <input type="text" name="" id="" placeholder="gender" className="w-full h-[50px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" value={gender} onChange={(e) => { Setgender(e.target.value) }} />

                    <div className="w-full mt-[20px] p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
                        <h1 className="text-[19px] font-bold">Skills</h1>
                        {
                            skills && <div className="flex flex-col gap-4">
                                {skills.map((skill, index) => (
                                    <div className="bg-gray-200  flex  justify-between items-center border-gray-600 w-full h-[40px] border-2 text-black p-[10px] " key={index}><span>{skill}</span><ImCross onClick={() => { RemoveSkill(skill) }} className="font-bold cursor-pointer text-gray-700" />

                                    </div>
                                ))}
                            </div>
                        }
                        <div className="flex flex-col gap-[10px]">
                            <input type="text" className="w-full h-[40px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" name="" id="" placeholder="Add new Skill" value={newskills} onChange={(e) => { Setnewskills(e.target.value) }} />
                            <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2ddcff] bg-[#2ddcff] text-white cursor-pointer" onClick={AddSkill}>Add</button>
                        </div>
                    </div>

                    <div className="w-full mt-[20px] p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
                        <h1 className="text-[19px] font-bold">Education</h1>
                        {
                            education && <div className="flex flex-col gap-4">
                                {education.map((edu, index) => (
                                    <div className="bg-gray-200  flex  justify-between items-center border-gray-600 w-full  border-2 text-black p-[10px] " key={index}>
                                        <div>
                                            <div>College : {edu.college}</div>
                                            <div>Degree : {edu.degree}</div>
                                            <div>Field of Study : {edu.fieldOfStudy}</div>
                                        </div>
                                        <ImCross onClick={() => { RemoveEducation(edu) }} className="font-bold cursor-pointer text-gray-700" />

                                    </div>
                                ))}
                            </div>
                        }
                        <div className="flex flex-col gap-[10px]">
                            <input type="text" placeholder="College" className="w-full h-[40px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" value={neweducation.college} onChange={(e) => { Setneweducation({ ...neweducation, college: e.target.value }) }} />
                            <input type="text" className="w-full h-[40px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" name="" id="" value={neweducation.degree} onChange={(e) => { Setneweducation({ ...neweducation, degree: e.target.value }) }} placeholder="Degree" />
                            <input type="text" className="w-full h-[40px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" name="" id="" value={neweducation.fieldOfStudy} onChange={(e) => { Setneweducation({ ...neweducation, fieldOfStudy: e.target.value }) }} placeholder="Field of Study" />
                            <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2ddcff] bg-[#2ddcff] text-white cursor-pointer" onClick={AddEducation} >Add</button>
                        </div>
                    </div>

                    <div className="w-full mt-[20px] p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg">
                        <h1 className="text-[19px] font-bold">Experience</h1>
                        {
                            experience && <div className="flex flex-col gap-4">
                                {experience.map((exp, index) => (
                                    <div className="bg-gray-200  flex  justify-between items-center border-gray-600 w-full  border-2 text-black p-[10px] " key={index}>
                                        <div>
                                            <div>Title : {exp.title}</div>
                                            <div>Company : {exp.company}</div>
                                            <div className="" >Discription : {exp.description}</div>
                                        </div>
                                        <ImCross onClick={() => { RemoveExperience(exp) }} className="font-bold cursor-pointer text-gray-700" />

                                    </div>
                                ))}
                            </div>
                        }
                        <div className="flex flex-col gap-[10px]">
                            <input type="text" placeholder="Title" className="w-full h-[40px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" value={newexperience.title} onChange={(e) => { Setnewexperience({ ...newexperience, title: e.target.value }) }} />
                            <input type="text" className="w-full h-[40px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" name="" id="" value={newexperience.company} onChange={(e) => { Setnewexperience({ ...newexperience, company: e.target.value }) }} placeholder="Company" />
                            <text type="text" className="w-full h-[40px] outline-none border-gray-600 border-2 px-[10px] rounded-lg" name="" id="" value={newexperience.description} onChange={(e) => { Setnewexperience({ ...newexperience, description: e.target.value }) }} placeholder="Discription" />
                            <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2ddcff] bg-[#2ddcff] text-white cursor-pointer" onClick={AddExperience} >Add</button>
                        </div>
                    </div>

                </div>

                <button className="w-[100%] mt-[50px] h-[40px] rounded-full border-2 text-white bg-[#2ddcff] cursor-pointer" onClick={() => { handelSaveProfile() }}>Save Profile</button>

            </div>
        </div>
    )
}

export default EditProfile