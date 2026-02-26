import Connection from "../models/connection.models"
import User from "../models/user.models"

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


export default connection