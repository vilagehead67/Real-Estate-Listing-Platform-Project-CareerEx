

const authRoute = require("./authRoute")

const propertyRoute = require("./propertyRoute")

const savePropertyRoute = require("./savePropertyRoute")


const routes= [
    authRoute,
    propertyRoute,
    savePropertyRoute
]

module.exports = routes