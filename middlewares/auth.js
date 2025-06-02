const jwt = require("jsonwebtoken")

const User = require("../models/User")


const validateRegister = (req, res, next) =>{
    const {firstName, lastName, email, phoneNumber, password} = req.body
    const errors = []
    if (!email) {
        errors.push("Please add your email")
    }
    if (!phoneNumber) {
        errors.push("Please add a phone number.")
    }
    if (!password) {
        errors.push("Please add your password")
    }
    if (errors.length >= 1) {
        return res.status(400).json({
            massage: errors
        }) 
    }

    next()
}

const authorization = async (req, res, next) =>{
    const token = req.header("Authorization")

    if (!token) {
        return res.status(401).json({
            message: "Please login!"
        })
    }
    const splitToken = token.split(" ")

    const realToken = splitToken[1]
    const decoded = jwt.verify(realToken, `${process.env.ACCESS_TOKEN}`)

    if (!decoded) {
        return res.status(401).json({
            message: "Invalid request."
        })
    }

    const user = await User.findById(decoded.id)
    if (!user) {
        return res.status(404).json({
            message: "User account does not exist."
        })
    }

    req.user = user
    next() 
}

module.exports = {
    validateRegister,
    authorization
}