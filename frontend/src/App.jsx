import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { useContext } from "react"
import { userDataContext } from "./contexts/UserContext.jsx"

function App() {
  const { UserData } = useContext(userDataContext)
  return (
    <>
      <Routes>
        <Route path="/" element={UserData ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={UserData ? <Navigate to="/" /> : <Signup />} />
        <Route path="/login" element={UserData ? <Navigate to="/" /> : <Login />} />
      </Routes>
    </>
  )
}

export default App