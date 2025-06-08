
const User = require("../models/User")

const { findUserService } = require("../service/indexService")



 // Get all users
     const  handleGetAllUsers = async(req, res)=>{
    try {
        const allUsers = await findUserService()
    res.status(200).json({
        message: "Success",
        allUsers
    })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

    // Get a user
    const handleGetSingleUser = async(req,res) =>{
        const {id} = req.params
        try {
            const user = await User.findById(id).select("-password -_v")
            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                })
            }
            res.status(200).json({
                message: "Success",
                user
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    const handleGetUserByQuery = async(req,res) =>{
        const {email, phoneNumber, firstName, lastName} = req.query
        try {
            const user = await User.findOne(email ? {email} : {phoneNumber}).select("-password -_v")
            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                })
            }
            res.status(200).json({
                message: "Success",
                user
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }

    module.exports = {
        handleGetAllUsers,
        handleGetSingleUser,
        handleGetUserByQuery
    }