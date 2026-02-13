import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const UploadOnCloudinary = async (filepath) => {

    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    try {
        if (!filepath) {
            return null
        }
        const uploadImage = await cloudinary.uploader.upload(filepath)
        fs.unlinkSync(filepath)
        return uploadImage.secure_url
    } catch (error) {
        fs.unlinkSync(filepath)
        console.log(error)
    }
}

export default UploadOnCloudinary