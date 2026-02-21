import express from "express";
import dotenv from "dotenv"
dotenv.config()
import connectdb from "./src/db/db.js";
import authrouter from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./src/routes/user.routes.js";
import postRouter from "./src/routes/post.routes.js";

const app = express()
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

app.listen(port, () => {
    connectdb()
    console.log("server running")
})