

const authRoute = require("./authRoute")

const userRoute = require("./userRoute")

const propertyRoute = require("./propertyRoute")

const savePropertyRoute = require("./savePropertyRoute")


const routes= [
    authRoute,
    userRoute,
    propertyRoute,
    savePropertyRoute
]

module.exports = routes