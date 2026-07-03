import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { useContext } from "react"
import { userDataContext } from "./contexts/UserContext.jsx"
import Network from "./pages/Network.jsx"
import Profilepage from "./pages/Profilepage.jsx"
import ChatWidget from "./components/ChatWidget.jsx"

function App() {
  const { UserData } = useContext(userDataContext)
  return (
    <>
      <Routes>
        <Route path="/" element={UserData ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={UserData ? <Navigate to="/" /> : <Signup />} />
        <Route path="/login" element={UserData ? <Navigate to="/" /> : <Login />} />
        <Route path="/network" element={UserData ? <Network /> : <Navigate to="/login" />} />
        <Route path="/profile/:userName" element={UserData ? <Profilepage /> : <Navigate to="/login" />} />
        <Route path="/profilepage" element={UserData ? <Navigate to={`/profile/${UserData.userName}`} /> : <Navigate to="/login" />} />
      </Routes>
      {UserData && <ChatWidget />}
    </>
  )
}

export default App