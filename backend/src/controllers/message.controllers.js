import Message from "../models/message.models.js"
import { io, userSocketMap } from "../../index.js"

export const sendMessage = async (req, res) => {
    try {
        const sender = req.userId
        const receiver = req.params.userId
        const { content } = req.body
        
        const message = await Message.create({
            sender,
            receiver,
            content
        })
        
        const receiverSocketId = userSocketMap.get(receiver)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", message)
        }
        
        return res.status(200).json(message)
    } catch (error) {
        return res.status(500).json({ message: "Send Message Error", error: error.message })
    }
}

export const getMessages = async (req, res) => {
    try {
        const myId = req.userId
        const otherUserId = req.params.userId
        
        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: otherUserId },
                { sender: otherUserId, receiver: myId }
            ]
        }).sort({ createdAt: 1 })
        
        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({ message: "Get Messages Error", error: error.message })
    }
}
