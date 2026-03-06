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
import http from "http"
import { Server } from "socket.io";

const app = express()
const server = http.createServer(app)
export const io = new Server(server, {
    cors: ({
        origin: "http://localhost:5173",
        credentials: true
    })
})

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
const port = process.env.PORT || 3000

app.use("/api/auth", authrouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/connection", connectionRouter)

export const userSocketMap = new Map()

io.on("connection", (socket) => {
    console.log("user connected", socket.id)
    socket.on("register", (userId) => {
        userSocketMap.set(userId, socket.id)
    })
    
    socket.on("disconnect", (socket) => {

    })
})

server.listen(port, async () => {
    await connectdb()
    console.log("server running")
})