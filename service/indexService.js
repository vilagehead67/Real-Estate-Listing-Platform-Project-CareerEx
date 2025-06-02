
const User = require("../models/User")




const findUserService = async() =>{
    const allUsers = await User.find()

    return allUsers
}

module.exports = {
    findUserService
}