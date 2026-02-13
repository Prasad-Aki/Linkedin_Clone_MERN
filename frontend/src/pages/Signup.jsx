import React, { useState } from "react"
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthDatacontext } from "../contexts/Authcontext"
import { useContext } from "react"
import { userDataContext } from "../contexts/UserContext.jsx"

function Signup() {
    const [isvisible, Setisvisible] = useState(false)
    const { serverurl } = useContext(AuthDatacontext)
    const [firstName, SetfirstName] = useState("")
    const [lastName, SetlastName] = useState("")
    const [userName, SetuserName] = useState("")
    const [email, Setemail] = useState("")
    const [password, Setpassword] = useState("")
    const [loading, Setloading] = useState(false)
    const navigate = useNavigate()

    function onclickisvisble() {
        Setisvisible(prev => !prev)
    }

    function navigatepagetologin() {
        navigate("/login")
    }

    const {UserData, SetUserData} = useContext(userDataContext)

    const handlesignup = async (e) => {
        e.preventDefault()
        Setloading(true)

        try {
            let result = await axios.post(serverurl + "/api/auth/signup", {
                firstName, lastName, userName, email, password
            }, { withCredentials: true })
            SetUserData(result.data)
            navigate("/")
            Setloading(false)
            SetfirstName("")
            SetlastName("")
            SetuserName("")
            Setemail("")
            Setpassword("")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="w-full h-screen bg-white flex flex-col items-center justify-start">

                <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
                    <img src={logo} alt="" />
                </div>

                <form onSubmit={handlesignup} className="w-[90%] max-w-[400px] h-[600px] flex flex-col justify-center md:shadow-xl gap-[10px] p-[15px]">
                    <h1 className="text-grey-800 text-[30px] font-semibold mb-[30px]" >Sign Up</h1>
                    <input className="w-[100%] h-[50px] border-2 border-grey-600 text-grey-800 text-[18px] px-[20px] py-[10px] rounded-md" type="text" placeholder="firstName" required onChange={(e) => { SetfirstName(e.target.value) }} value={firstName} />
                    <input className="w-[100%] h-[50px] border-2 border-grey-600 text-grey-800 text-[18px] px-[20px] py-[10px] rounded-md" type="text" placeholder="lastName" required onChange={(e) => { SetlastName(e.target.value) }} value={lastName} />
                    <input className="w-[100%] h-[50px] border-2 border-grey-600 text-grey-800 text-[18px] px-[20px] py-[10px] rounded-md" type="text" placeholder="userName" required onChange={(e) => { SetuserName(e.target.value) }} value={userName} />
                    <input className="w-[100%] h-[50px] border-2 border-grey-600 text-grey-800 text-[18px] px-[20px] py-[10px] rounded-md" type="email" placeholder="email" required onChange={(e) => { Setemail(e.target.value) }} value={email} />
                    <div className="w-[100%] h-[50px] border-2 border-grey-600 text-grey-800 text-[18px] rounded-md relative">
                        <input className="w-full h-full border-none text-grey-800 text-[18px] px-[20px] py-[10px] rounded-md" type={isvisible ? "text" : "password"} placeholder="password" required onChange={(e) => { Setpassword(e.target.value) }} value={password} />
                        <span className="absolute cursor-pointer right-[20px] top-[10px] text-[#009ac9]" onClick={onclickisvisble} >{isvisible ? "hidden" : "show"}</span>
                    </div>
                    <button className="w-[100%] h-[40px] rounded-full bg-[#1dc9fd] mt-[30px] cursor-pointer" disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
                    <p onClick={navigatepagetologin} className="text-center cursor-pointer">Already have an account ? <span className="text-[#00c3ff]" >Sign In</span></p>
                </form>

            </div>
        </>
    )
}

export default Signup