import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getMessages, sendMessage } from "../controllers/message.controllers.js"

const messageRouter = express.Router()

messageRouter.post("/send/:userId", isAuth, sendMessage)
messageRouter.get("/chat/:userId", isAuth, getMessages)

export default messageRouter
