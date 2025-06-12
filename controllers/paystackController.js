
const axios = require("axios")
const User = require("../models/User")

// Initialize transaction
const handleInitializeTransaction = async(req, res) => {
    const {email, amount} = req.body
    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                // convert to kobo
                amount: 20000 * 100, 
                callback_url: `{process.env.CALLBACK_URL}/api/payment/verify`
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        )

        const {authorization_url, reference } = response.data.data
        res.status(200).json({
            message: "Transaction initialized",
            authorization_url,
            reference
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to initialize transaction",
            error: error.message
        })
    }
}

// Verify paystack transaction
const handleVerifyTransaction = async(req,res) =>{
    const { reference } = req.query
    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        )
        const paymentData = response.data.data
        if (paymentData.status === "success") {
            const email = response.data.data.customer.email

            const user = await User.findOne({email})
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }
            user.isSubscribed = true
            user.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            await user.save()
            
            return res.status(200).json({
                message: "Payment verified successfully",
                paymentData
            })
        }else{
            return res.status(400).json({
                message: "Payment not successful"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Payment verification failed"
        })
    }
}


module.exports = {
    handleInitializeTransaction,
    handleVerifyTransaction
}