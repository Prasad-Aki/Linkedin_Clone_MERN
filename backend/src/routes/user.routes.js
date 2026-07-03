import express from "express"
import isAuth from "../middlewares/isAuth.js"
import getCurrentUser, { UpdateProfile, getProfile, searchUsers, getSuggestions } from "../controllers/user.controllers.js"
import Upload from "../middlewares/multer.js"

const userRouter = express.Router()

userRouter.get("/currentuser", isAuth, getCurrentUser)
userRouter.get("/suggestions", isAuth, getSuggestions)
userRouter.put("/updateprofile", isAuth, Upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), UpdateProfile)
userRouter.get("/profile/:userName", isAuth, getProfile)
userRouter.get("/search", isAuth, searchUsers)

export default userRouter