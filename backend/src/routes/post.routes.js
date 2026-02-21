import express from "express"
import isAuth from "../middlewares/isAuth.js"
import Upload from "../middlewares/multer.js"
import createPost from "../controllers/post.controllers.js"

const postRouter = express.Router()

postRouter.post("/createpost", isAuth, Upload.single("image"), createPost)

export default postRouter