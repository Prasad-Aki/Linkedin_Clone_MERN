import express from "express"
import {login, logout, signup} from "../controllers/auth.controllers.js"

let authrouter = express.Router()
authrouter.post("/signup", signup)
authrouter.post("/login", login)
authrouter.post("/logout", logout)

export default authrouter