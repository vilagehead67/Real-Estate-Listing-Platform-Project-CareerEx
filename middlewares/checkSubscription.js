
const checkSubscription = (req, res, next) =>{
    const user = req.user

    // check if user is an agent
    if (user.role !== "agent") {
        return res.status(403).json({
            message: "Only agents can perform this action."
        })
    }

    // check if agent is subscribed
    if (!user.isSubscribed) {
        return res.status(403).json({
            message: "Subscription required to list properties."
        })
    }

    // Check if subscription is expired
    const now = new Date()
    if (user.subscriptionExpiresAt && user.subscriptionExpiresAt < now) {
        return res.status(403).json({
            message: "Your subscription has expired. Please renew."
        })
    }
    next()
}

module.exports = checkSubscription