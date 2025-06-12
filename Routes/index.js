

const authRoute = require("./authRoute")

const userRoute = require("./userRoute")

const propertyRoute = require("./propertyRoute")

const savePropertyRoute = require("./savePropertyRoute")

const paystackRoute = require("./paystackRoute")


const routes= [
    authRoute,
    userRoute,
    propertyRoute,
    savePropertyRoute,
    paystackRoute
]

module.exports = routes