
const express = require("express");
const { validateRegister, authorization } = require("../middlewares/auth");
const { handleUserRegistration, handleUserLogin, handleForgottenPassword, handleResetPassword, handleUserLogout, handleActivationCode, handleResendActivationCode, } = require("../controllers/authController");

const router = express.Router();

//  Registeration: Agent/User Roles
router.post("/auth/register", validateRegister, handleUserRegistration)

// Resend activation code
router.post("/auth/resend", handleResendActivationCode)

//  Activation code

router.post("/auth/verify", handleActivationCode)

//  User/Agent Login
router.post("/auth/login", handleUserLogin)

// Forgotten password
router.post("/forgotten-password", handleForgottenPassword)

// Reset password
router.post("/reset-password/:userId/:token", authorization, handleResetPassword)

// User/Agent Logout
router.post("/logout", handleUserLogout)




module.exports = router