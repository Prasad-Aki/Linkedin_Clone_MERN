import UploadOnCloudinary from "../db/cloudinary.js"
import User from "../models/user.models.js"
import Connection from "../models/connection.models.js"

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            return res.status(404).json({ message: "user dosen't found" })
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

export const getProfile = async (req, res) => {
    try {
        let { userName } = req.params
        let user = await User.findOne({ userName }).select("-password")
        if (!user) {
            return res.status(404).json({ message: "userName does not exist" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: "Server Error" })
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query
        if (!query) {
            return res.status(200).json([])
        }
        const users = await User.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { userName: { $regex: query, $options: "i" } },
                { skills: { $in: [new RegExp(query, "i")] } }
            ]
        }).select("firstName lastName userName profileImage headline").limit(10)
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: "Search Error", error: error.message })
    }
}

export const getSuggestions = async (req, res) => {
    try {
        const currentUserId = req.userId
        const currentUser = await User.findById(currentUserId)
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" })
        }

        // Find connection requests involving the current user to exclude
        const pendingConnections = await Connection.find({
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId }
            ],
            status: "pending"
        })

        // Exclude current user, current connections, and pending connection users
        const excludedUserIds = new Set([
            currentUserId.toString(),
            ...(currentUser.connection || []).map(id => id.toString())
        ])

        pendingConnections.forEach(conn => {
            if (conn.sender) excludedUserIds.add(conn.sender.toString())
            if (conn.receiver) excludedUserIds.add(conn.receiver.toString())
        })

        // Query suggestions from User model
        const suggestions = await User.find({
            _id: { $nin: Array.from(excludedUserIds) }
        })
        .select("firstName lastName userName profileImage headline")
        .limit(3)

        return res.status(200).json(suggestions)
    } catch (error) {
        console.error("Error in getSuggestions:", error)
        return res.status(500).json({ message: "getSuggestions error", error: error.message })
    }
}


export default getCurrentUser