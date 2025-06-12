
const express = require("express")
const { authorization } = require("../middlewares/auth")
const { agentAuthorization } = require("../middlewares/agentAuth")
const { handleInitializeTransaction, handleVerifyTransaction } = require("../controllers/paystackController")
const router = express.Router()


router.post("/payment/initialize", authorization, agentAuthorization, handleInitializeTransaction)

router.get("/payment/verify",  handleVerifyTransaction)

module.exports = router