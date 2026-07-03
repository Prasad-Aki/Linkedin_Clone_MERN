import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    type: { 
        type: String, 
        enum: ["like", "comment", "connection_request", "connection_accept"], 
        required: true 
    },
    postRef: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post" 
    },
    read: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

const Notification = mongoose.model("Notification", notificationSchema)
export default Notification
