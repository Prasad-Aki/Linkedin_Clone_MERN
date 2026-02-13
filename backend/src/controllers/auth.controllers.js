import generatetoken from "../db/token.js"
import User from "../models/user.models.js"
import bcrypt from "bcryptjs"

const signup = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body
        let existeduser = await User.findOne({ email, userName })
        if (existeduser) {
            return res.status(400).json({ message: "user already existed !" })
        }

        let hashedpassword = await bcrypt.hash(password, 10)

        const createduser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedpassword
        })

        let token = await generatetoken(createduser._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: process.env.NODE_ENVIRONMENT === "production"
        })
        return res.status(201).json(createduser)
    } catch (error) {
        return res.status(500).json({ message: "signup error" })
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = await req.body
        const createduser = await User.findOne({ email })
        console.log(req.body);
        if (!createduser) {
            return res.status(400).json({ message: "user not exist" })
        }

        const ismatchpassword = await bcrypt.compare(password, createduser.password)
        if (!ismatchpassword) {
            return res.status(400).json({ message: "wrong password" })
        }

        let token = await generatetoken(createduser._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: process.env.NODE_ENVIRONMENT === "production"
        })
        return res.status(200).json(createduser)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "login error" })
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({ message: "logout done" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "logout error" })
    }
}

export {
    signup,
    login,
    logout
}