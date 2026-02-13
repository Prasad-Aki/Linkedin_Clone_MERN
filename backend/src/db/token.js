import jwt from "jsonwebtoken"

const generatetoken = async (userId) => {
    try {
        let token = await jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return token
    } catch (error) {
        console.log(error)
    }
}

export default generatetoken