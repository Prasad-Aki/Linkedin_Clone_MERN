import express from "express"
import isAuth from "../middlewares/isAuth.js"
import Upload from "../middlewares/multer.js"
import createPost, { getPosts } from "../controllers/post.controllers.js"

const postRouter = express.Router()

postRouter.get("/create", isAuth, Upload.single("image"), createPost)
postRouter.get("/all", isAuth, getPosts)

export default postRouter