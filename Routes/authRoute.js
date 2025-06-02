
const express = require("express");
const { validateRegister, authorization } = require("../middlewares/auth");
const { handleUserRegistration, handleUserLogin, handleForgottenPassword, handleResetPassword, handleGetAllUsers } = require("../controllers/authController");

const router = express.Router();

//  Registeration: Agent/User Roles
router.post("/auth/register", validateRegister, handleUserRegistration)

//  User/Agent Login
router.post("/auth/login", handleUserLogin)

// Forgotten password
router.post("/forgotten-password", handleForgottenPassword)

// Reset password
router.patch("/reset-password", authorization, handleResetPassword)

//  get all-users
router.get("/users", authorization, handleGetAllUsers)




module.exports = router