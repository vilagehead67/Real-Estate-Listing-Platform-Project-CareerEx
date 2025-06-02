
const express = require("express")
const { authorization } = require("../middlewares/auth")
const { agentAuthorization } = require("../middlewares/agentAuth")
const { handlePropertyListingsByAgent, handleGetAvailableProperties, handleGetSpecificProperty, handleUpdatePropertyByAgent, handleDeletePropertyByAgent } = require("../controllers/propertyController")

const router = express.Router()

// Property listings by agents
 router.post("/agent/add-property", authorization, agentAuthorization, handlePropertyListingsByAgent)

//  Property update by an agent
router.patch("/agent/update-property/:id", authorization, agentAuthorization, handleUpdatePropertyByAgent )

//  Property delete by agent
router.delete("/agent/delete-property/:id", authorization, agentAuthorization, handleDeletePropertyByAgent)

// Get all available Properties
router.get("/properties", authorization, handleGetAvailableProperties)

// Get Specific property by ID
router.get("/properties/:id", authorization, handleGetSpecificProperty)







module.exports = router