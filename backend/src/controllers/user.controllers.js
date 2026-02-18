import UploadOnCloudinary from "../db/cloudinary.js"
import User from "../models/user.models.js"


const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            console.log(user)
            return res.status(400).json({ message: "user dosen't found" })
        }
        return res.status(200).json({ message: "user found succesfully", user })
    } catch (error) {
        return res.status(400).json({ message: "current user error" })
    }
}

export const UpdateProfile = async (req, res) => {
    try {
        const { firstName, lastName, userName, headline, location, gender } = req.body
        let profileImage
        let coverImage
        let skills = req.body.skills ? JSON.parse(req.body.skills) : []
        let education = req.body.education ? JSON.parse(req.body.education) : []
        let experience = req.body.experience ? JSON.parse(req.body.experience) : []

        if (req.files?.profileImage) {
            profileImage = await UploadOnCloudinary(req.files.profileImage[0].path)
        }

        if (req.files?.coverImage) {
            coverImage = await UploadOnCloudinary(req.files.coverImage[0].path)
        }


        let user = await User.findByIdAndUpdate(req.userId, {
            firstName, lastName, userName, headline, location, gender, skills, education, experience, profileImage, coverImage
        }, { new: true }).select("-password")

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Update Profile Error..." })
    }
}

export default getCurrentUser