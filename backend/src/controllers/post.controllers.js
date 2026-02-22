import UploadOnCloudinary from "../db/cloudinary.js"
import Post from "../models/post.models.js"

const createPost = async (req, res) => {
    try {
        const { discription } = req.body
        let newPost
        if (req.file) {
            const image = await UploadOnCloudinary(req.file.path)
            newPost = await Post.create({

                author: req.userId,
                discription,
                image
            })
        } else {
            newPost = await Post.create({
                author: req.userId,
                discription
            })
        }
        return res.status(201).json(newPost)
    } catch (error) {
        return res.status(500).json({ message: " create Post Error..." })
    }
}

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author")
            .sort({ createdAt: -1 })

        return res.status(200).json(posts)

    } catch (error) {
        return res.status(500).json({ message: "Get Posts Error..." })
    }
}

export default createPost