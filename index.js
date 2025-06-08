
const express = require("express")

const mongoose = require("mongoose")

const dotenv = require("dotenv")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const User = require("./models/User")

const Property = require("./models/Property")

const SavedProperty = require("./models/SavedProperty")

const routes = require("./Routes")


dotenv.config()


const app = express()

app.use(express.json())

const PORT = process.env.PORT || 8000

// Database connection
mongoose.connect(process.env.MONGODB_URL).then(() =>{
    console.log("MOngoDB connected.....")

// Start server 
app.listen(PORT, () =>{
    console.log(`Server started running on port ${PORT}`)
    })
})

app.get("/", (req, res) =>{
    res.send("Welcome to Prof. J. Momoh's Real Estate server")
 })


 
app.use("/api", routes)














 











// Get the we can the   