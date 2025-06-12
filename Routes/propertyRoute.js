
const express = require("express")
const { authorization } = require("../middlewares/auth")
const { agentAuthorization } = require("../middlewares/agentAuth")
const { handlePropertyListingsByAgent, handleGetAvailableProperties, handleGetSpecificProperty, handleUpdatePropertyByAgent, handleDeletePropertyByAgent, handleApproveProperty, handleGetAllPropertiesForAdmin, handleGetPendingListings } = require("../controllers/propertyController")
const adminAuthorization = require("../middlewares/adminAuth")
const checkSubscription = require("../middlewares/checkSubscription")


const router = express.Router()

// Property listings by agents
 router.post("/agent/list-property", authorization, agentAuthorization, checkSubscription, handlePropertyListingsByAgent)

//  Property update by an agent
router.patch("/agent/update-property/:id", authorization, agentAuthorization, handleUpdatePropertyByAgent )

//  Property delete by agent
router.delete("/agent/delete-property/:id", authorization, agentAuthorization, handleDeletePropertyByAgent)

// 
router.get("/admin/all-properties", authorization, adminAuthorization, handleGetAllPropertiesForAdmin)

// 
router.get("/agent/pending-listings", authorization, agentAuthorization, handleGetPendingListings)

// Admin approve property amd Notification
router.patch("/approve/:id", authorization, adminAuthorization, handleApproveProperty)


// Get all available Properties and 
router.get("/properties", authorization, handleGetAvailableProperties)

// Get Specific property by ID
router.get("/properties/:id", authorization, handleGetSpecificProperty)







module.exports = router