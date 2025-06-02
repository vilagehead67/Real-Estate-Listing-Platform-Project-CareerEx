
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    email: {type: String, require: true},
    phoneNumber: {type: Number, require: true},
    password: {type: String, require: true},
    role: {
        type: String, 
        enum: ["agent", "user"], 
        default: "user"
         }

})

const User = new mongoose.model("User", userSchema);

module.exports = User