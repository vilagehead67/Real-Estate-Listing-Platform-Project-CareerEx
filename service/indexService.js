
const User = require("../models/User")




const findUserService = async() =>{
    const allUsers = await User.find().select("-password -_v")
    if (!allUsers) {
        return res.status(404).json({
            message: "Error loading request."
        })
    }


    return allUsers
}
 

module.exports = {
    findUserService,
}