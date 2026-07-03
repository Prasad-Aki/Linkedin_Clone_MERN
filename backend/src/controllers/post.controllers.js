// import React, { useId } from "react"
import { io, userSocketMap } from "../../index.js"
import UploadOnCloudinary from "../db/cloudinary.js"
import Post from "../models/post.models.js"
import Notification from "../models/notification.models.js"

const createPost = async (req, res) => {
    try {
        const { description } = req.body
        let newPost
        if (req.file) {
            const image = await UploadOnCloudinary(req.file.path)
            newPost = await Post.create({
                author: req.userId,
                description,
                image
            })
        } else {
            newPost = await Post.create({
                author: req.userId,
                description
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
            return res.status(404).json({ message: "Post not found" })
        }
        let likeAdded = false
        if (post.like.includes(userId)) {
            post.like = post.like.filter((id) => id != userId)
        } else {
            post.like.push(userId)
            likeAdded = true
        }
        await post.save()
        io.emit("likeUpdated", { postId, likes: post.like })

        if (likeAdded && post.author.toString() !== userId) {
            const notification = await Notification.create({
                recipient: post.author,
                sender: userId,
                type: "like",
                postRef: postId
            })
            const populatedNotif = await notification.populate("sender", "firstName lastName profileImage headline userName")
            const targetSocketId = userSocketMap.get(post.author.toString())
            if (targetSocketId) {
                io.to(targetSocketId).emit("newNotification", populatedNotif)
            }
        }

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
        const originalPost = await Post.findById(postId)
        if (!originalPost) {
            return res.status(404).json({ message: "Post not found" })
        }

        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comment: { content, user: userId } }
        }, { new: true })
            .populate("comment.user", "firstName lastName profileImage headline")
            .sort({ createdAt: -1 })

        io.emit("commentAdded", { postId, comm: post.comment })

        if (originalPost.author.toString() !== userId) {
            const notification = await Notification.create({
                recipient: originalPost.author,
                sender: userId,
                type: "comment",
                postRef: postId
            })
            const populatedNotif = await notification.populate("sender", "firstName lastName profileImage headline userName")
            const targetSocketId = userSocketMap.get(originalPost.author.toString())
            if (targetSocketId) {
                io.to(targetSocketId).emit("newNotification", populatedNotif)
            }
        }

        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized to delete this post" })
        }
        
        await Post.findByIdAndDelete(postId)
        return res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Delete Post Error", error: error.message })
    }
}

export const editPost = async (req, res) => {
    try {
        const postId = req.params.id
        const { description } = req.body
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized to edit this post" })
        }
        
        post.description = description
        await post.save()
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({ message: "Edit Post Error", error: error.message })
    }
}

export default createPost