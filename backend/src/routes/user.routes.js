import express from "express"
import isAuth from "../middlewares/isAuth.js"
import getCurrentUser, { UpdateProfile } from "../controllers/user.controllers.js"
import Upload from "../middlewares/multer.js"

const userRouter = express.Router()

userRouter.get("/currentuser", isAuth, getCurrentUser)
userRouter.put("/updateprofile", isAuth, Upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), UpdateProfile)


export default userRouter