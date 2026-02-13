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

export default getCurrentUser