// import React, { useId } from "react"
import { io } from "../../index.js"
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
            .populate("author", "firstName lastName profileImage headline")
            .populate("comment.user", "firstName lastName profileImage headline")
            .sort({ createdAt: -1 })

        return res.status(200).json(posts)

    } catch (error) {
        return res.status(500).json({ message: "Get Posts Error..." })
    }
}

export const like = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.userId
        const post = await Post.findById(postId)
        if (!post) {
            return res.json({ message: "Post not found" })
        }
        if (post.like.includes(userId)) {
            post.like = post.like.filter((id) => id != userId)
        } else {
            post.like.push(userId)
        }
        await post.save()
        io.emit("likeUpdated", { postId, likes: post.like })

        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

export const comment = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.userId
        const { content } = req.body
        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comment: { content, user: userId } }
        }, { new: true })
            .populate("comment.user", "firstName lastName profileImage headline")
            .sort({ createdAt: -1 })

        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

export default createPost