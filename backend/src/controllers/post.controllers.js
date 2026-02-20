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
            const newPost = await Post.create({
                author: req.userId,
                discription
            })
        }
        return res.status(201).json(newPost)
    } catch (error) {
        return res.status(500).json({ message: " create Post Error..." })
    }
}

export default createPost