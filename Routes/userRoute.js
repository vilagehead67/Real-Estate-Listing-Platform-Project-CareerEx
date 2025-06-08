 const express = require("express")
const { authorization } = require("../middlewares/auth")
const { handleGetAllSavedProperties } = require("../controllers/savedPropertyController")
const { handleGetSingleUser, handleGetUserByQuery } = require("../controllers/user.Controller");
const adminAuthorization = require("../middlewares/adminAuth");

const router = express.Router();

//  get all-users
router.get("/all-users", authorization, adminAuthorization, handleGetAllSavedProperties)

// Get a user
router.get("/user/:id", authorization, adminAuthorization, handleGetSingleUser)

// Get by email or phone number
router.get("/user", authorization, adminAuthorization, handleGetUserByQuery)

module.exports = router