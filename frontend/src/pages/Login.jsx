import React, { useContext, useState } from "react"
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthDatacontext } from "../contexts/Authcontext"
import { userDataContext } from "../contexts/UserContext.jsx"

function Login() {
    const [isvisible, Setisvisible] = useState(false)
    const { serverurl } = useContext(AuthDatacontext)
    const [email, Setemail] = useState("")
    const [password, Setpassword] = useState("")
    const navigate = useNavigate()

    function NavigatetoSignup() {
        navigate("/signup")
    }

    const { UserData, SetUserData } = useContext(userDataContext)


    function showpassword() {
        Setisvisible(prev => !prev)
    }

    const handelLogin = async (e) => {
        try {
            e.preventDefault()

            let result = await axios.post(serverurl + "/api/auth/login", {
                email, password
            }, { withCredentials: true })
            console.log(result)
            SetUserData(result.data)
            navigate("/")
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

                <form onSubmit={handelLogin} className="w-[90%] max-w-[400px] h-[600px] flex flex-col justify-center md:shadow-xl gap-[10px] p-[15px]">
                    <h1 className="text-grey-800 text-[30px] font-semibold mb-[30px]" >Log In</h1>
                    <input className="w-[100%] h-[50px] border-2 border-grey-600 text-grey-800 text-[18px] px-[20px] py-[10px] rounded-md" type="email" placeholder="email" required value={email} onChange={(e) => { Setemail(e.target.value) }} />
                    <div className="w-[100%] h-[50px] border-2 border-grey-600 text-grey-800 text-[18px] rounded-md relative">
                        <input className="w-full h-full border-none text-grey-800 text-[18px] px-[20px] py-[10px] rounded-md" placeholder="password" required type={isvisible ? "text" : "password"} value={password} onChange={(e) => { Setpassword(e.target.value) }} />
                        <span className="absolute cursor-pointer right-[20px] top-[10px] text-[#009ac9]" onClick={showpassword} >{isvisible ? "hidden" : "show"}</span>
                    </div>
                    <button className="w-[100%] h-[40px] rounded-full bg-[#1dc9fd] mt-[30px] cursor-pointer" >Log In</button>
                    <p className="text-center cursor-pointer" onClick={NavigatetoSignup} >Dont' have an account ? <span className="text-[#00c3ff]" >Sign Up</span></p>
                </form>

            </div>
        </>
    )
}

export default Login