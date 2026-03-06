import Connection from "../models/connection.models.js"
import User from "../models/user.models.js"
import { io } from "../../index.js"
import { userSocketMap } from "../../index.js"

const connection = async (req, res) => {
    try {
        const { id } = req.params
        const sender = req.userId
        const user = await User.findById(sender)
        if (sender == id) {
            return res.status(400).json({ message: "you can't send request to yourself" })
        }
        if (user.connection.includes(id)) {
            return res.status(400).json({ message: "you are already connected" })
        }
        const existingConnection = await Connection.findOne({
            sender,
            receiver: id,
            status: "pending"
        })
        if (existingConnection) {
            return res.status(400).json({ message: "request already send" })
        }
        const newRequest = await Connection.create({
            sender,
            receiver: id
        })

        const receiverSocketId = userSocketMap.get(id)
        const senderSocketid = userSocketMap.get(sender)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusupdate", { updatedUserId: sender, newStatus: "received" })
        }

        if (senderSocketid) {
            io.to(senderSocketid).emit("statusupdate", { updatedUserId: id, newStatus: "pending" })
        }

        return res.status(200).json(newRequest)
    } catch (error) {

    }
}



export const acceptConnection = async (req, res) => {
    try {
        const { connectionId } = req.params
        const connection = await Connection.findById(connectionId)
        if (!connection) {
            return res.status(400).json({ message: "connection doesn't exist" })
        }
        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" })
        }
        connection.status = "accepted"
        await connection.save()

        await User.findByIdAndUpdate(req.userId, {
            $addToSet: { connection: connection.sender._id }
        })
        await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet: { connection: req.userId }
        })

        const receiverSocketId = userSocketMap.get(connection.receiver._id.toString())
        const senderSocketid = userSocketMap.get(connection.sender._id.toString())

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusupdate", { updatedUserId: connection.sender._id, newStatus: "disconnect" })
        }

        if (senderSocketid) {
            io.to(senderSocketid).emit("statusupdate", { updatedUserId: connection.receiver._id, newStatus: "disconnect" })
        }


        return res.status(200).json({ message: "connection accepted" })
    } catch (error) {
        return res.status(500).json({ message: "connection accepted error" })
    }
}

export const rejectConnection = async (req, res) => {
    try {
        const { connectionId } = req.params
        const connection = await Connection.findById(connectionId)
        if (!connectionId) {
            return res.status(400).json({ message: "connection doesn't exist" })
        }
        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" })
        }
        connection.status = "rejected"
        await connection.save()


        return res.status(200).json({ message: "connection rejected" })
    } catch (error) {
        return res.status(500).json({ message: "connection rejected error" })
    }
}

export const getConnectionStatus = async (req, res) => {
    try {
        const currentUserId = req.userId
        const targetUserId = req.params.userId

        const currentUser = await User.findById(currentUserId)
        if (currentUser.connection.includes(targetUserId)) {
            return res.json({ status: "connected" })
        }
        const pendingRequest = await Connection.findOne({
            $or: [
                { sender: currentUserId, receiver: targetUserId },
                { sender: targetUserId, receiver: currentUserId }
            ],
            status: "pending"
        })
        if (pendingRequest) {
            if (pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.json({ status: "pending" })
            } else {
                return res.json({ status: "received", requestId: pendingRequest._id })
            }
        }

        return res.json({ status: "connect" })
    } catch (error) {
        return res.json({ message: "getStatuConnection error" })
    }
}

export const removeConnection = async (req, res) => {
    try {
        const myId = req.userId;
        const otherUserId = req.params.userId;

        await User.findByIdAndUpdate(myId, {
            $pull: { connection: otherUserId }
        });

        await User.findByIdAndUpdate(otherUserId, {
            $pull: { connection: myId }
        });

        const receiverSocketId = userSocketMap.get(otherUserId)
        const senderSocketid = userSocketMap.get(myId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("statusupdate", { updatedUserId: myId, newStatus: "connect" })
        }

        if (senderSocketid) {
            io.to(senderSocketid).emit("statusupdate", { updatedUserId: otherUserId, newStatus: "connect" })
        }

        return res.json({ message: "Connection removed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "removeConnection error" });
    }
}

export const getconnectionrequests = async (req, res) => {
    try {
        const userId = req.userId
        const requests = await Connection.find({ receiver: userId, status: "pending" }).populate("sender", "firstName lastName userName profileImage headline")
        return res.status(200).json(requests)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "get connection requests error" })
    }
}

export const getUserConnections = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate(
            "connection",
            "firstName lastName userName profileImage headline connection"
        );

        return res.status(200).json(user.connection);
    } catch (error) {
        console.error("Error in getUserConnections controller:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export default connection