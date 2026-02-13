import mongoose from "mongoose"

const connectdb = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected ")
    } catch (error) {
        console.error("MongoDB connection failed", error)
    }
}

export default connectdb