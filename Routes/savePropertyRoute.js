

const express = require("express")
const { authorization } = require("../middlewares/auth")
const { handleSaveProperty, handleUnsaveProperty, handleGetAllSavedProperties } = require("../controllers/savedPropertyController")

const router = express.Router()
  

// Save a property
router.post("/save-property", authorization, handleSaveProperty)

// Unsave a property
router.delete("/unsave/:propertyId", authorization, handleUnsaveProperty)

// Get all saved properties for a user
router.get("/saved/properties", authorization, handleGetAllSavedProperties)






module.exports = router