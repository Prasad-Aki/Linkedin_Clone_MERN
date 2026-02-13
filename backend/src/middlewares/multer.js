import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const Upload = multer({ storage })

export default Upload