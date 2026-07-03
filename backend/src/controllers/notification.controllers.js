import Notification from "../models/notification.models.js"

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            .populate("sender", "firstName lastName profileImage headline userName")
            .populate("postRef", "description")
            .sort({ createdAt: -1 })
            .limit(50)
            
        return res.status(200).json(notifications)
    } catch (error) {
        return res.status(500).json({ message: "Get Notifications Error", error: error.message })
    }
}

export const markAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.userId, read: false }, { $set: { read: true } })
        return res.status(200).json({ message: "Notifications marked as read" })
    } catch (error) {
        return res.status(500).json({ message: "Mark Notifications Read Error", error: error.message })
    }
}
