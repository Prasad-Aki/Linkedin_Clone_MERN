import express from "express";
import dotenv from "dotenv"
dotenv.config()
import connectdb from "./src/db/db.js";
import authrouter from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./src/routes/user.routes.js";
import postRouter from "./src/routes/post.routes.js";
import connectionRouter from "./src/routes/connection.routes.js";
import notificationRouter from "./src/routes/notification.routes.js";
import messageRouter from "./src/routes/message.routes.js";
import http from "http"
import { Server } from "socket.io";

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
}

const app = express()
const server = http.createServer(app)
export const io = new Server(server, {
    cors: corsOptions,
})

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
const port = process.env.PORT || 3000

app.use("/api/auth", authrouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/connection", connectionRouter)
app.use("/api/notification", notificationRouter)
app.use("/api/message", messageRouter)

export const userSocketMap = new Map()

io.on("connection", (socket) => {
    socket.on("register", (userId) => {
        socket.userId = userId
        userSocketMap.set(userId, socket.id)
        console.log("Registered to socket map:", userId)
    })

    socket.on("disconnect", () => {
        if (socket.userId) {
            userSocketMap.delete(socket.userId)
            console.log("Unregistered from socket map:", socket.userId)
        }
    })
})

server.listen(port, async () => {
    await connectdb()
    console.log("server running")
})