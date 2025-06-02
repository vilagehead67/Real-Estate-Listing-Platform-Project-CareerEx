
const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema({
    title: {type: String, require: true},
    description: {type: String, default: ""},
    price: {type: Number, require: true},
    location: {type: String, require: true},
    image: {type: String, require: true},
    category: {
        type: String, 
        enum: ["rent", "sale"], 
        require: true},
    agent: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        require: true}
    }, {timestamps: true})

const Property = new mongoose.model("Property", propertySchema)

module.exports = Property