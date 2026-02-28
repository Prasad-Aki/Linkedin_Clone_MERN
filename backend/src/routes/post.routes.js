import express from "express"
import isAuth from "../middlewares/isAuth.js"
import Upload from "../middlewares/multer.js"
import createPost, { comment, getPosts, like } from "../controllers/post.controllers.js"

const postRouter = express.Router()

postRouter.post("/create", isAuth, Upload.single("image"), createPost)
postRouter.get("/all", isAuth, getPosts)
postRouter.post("/like/:id", isAuth, like)
postRouter.post("/comment/:id", isAuth, comment)

export default postRouter