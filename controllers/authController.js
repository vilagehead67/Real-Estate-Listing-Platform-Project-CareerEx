
const User = require("../models/User")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const sendMail = require("../sendMail")
const {validEmail} = require("../sendMail")
const { findUserService } = require("../service/indexService")

//  User registration
const handleUserRegistration = async(req, res) =>{
    try {
    const {firstName, lastName, email, phoneNumber, password, role} = req.body
      if (!firstName) {
         return  res.status(400).json({
            message: "Enter your firstname"
        })
      }

      if (!lastName) {
         return res.status(400).json({
            message: "Enter your lastname"
        })
      }
      
     if (!validEmail(email)) {
            return res.status(400).json({
                message: "Incorrect email format"
            })
        }

      const existingUser = await User.findOne({email})

      if (existingUser) {
        return res.status(400).json({
            message: "Account already exist."
        })
      }

      const existingPhoneNumber = await User.findOne({phoneNumber})

      if (existingPhoneNumber) {
            return res.status(400).json({
                message: "Phone number has been taken."
            })
      }

      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
      if (!passwordRegex.test(password)){
        return res.status(400).json({
            message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
        })
      }
        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = new User({
             firstName, 
             lastName, 
             email,
             phoneNumber,  
             password: hashedPassword, 
             role
        });
        await newUser.save();
        
        res.status(201).json({
            message: "User account created successfully",
            newUser:{
                firstName,lastName, email, phoneNumber, role
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
    
 }

     //  Login
    const handleUserLogin = async(req, res) =>{
    const {identifier, password} = req.body
      try {
        const isEmail = identifier.includes("@")

        const user = await User.findOne(
            isEmail ? {email: identifier} : {phoneNumber: identifier}
        )
        if (!user) {
            return res.status(400).json({
                message: "User account does not exist."
            })
        }
    
        const isMatch = await bcrypt.compare(password, user?.password)
    
        if (!isMatch) {
            return res.status(400).json("Incorrect login details.")
        }
        
        // Generate a token
        const accessToken = jwt.sign(
            {id: user?._id},
            process.env.ACCESS_TOKEN,
            {expiresIn: "5m"}
        )
    
        const refreshToken = jwt.sign(
            {id: user?._id},
            process.env.REFRESH_TOKEN,
            {expiresIn: "30d"}
        )
         res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                phoneNumber: user?.phoneNumber,
                role: user?.role
            },
    
            refreshToken
         })
         
         } catch (error) {
           res.status(500).json({
            message: error.message
           })
     }
    }

    // Forgotten Password
     const handleForgottenPassword = async(req,res)=>{
      const {email} = req.body
      try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({
                message: "User account not found."
            })
        }
        const accessToken = await jwt.sign(
        {user}, 
        `${process.env.ACCESS_TOKEN}`, 
        {expiresIn: "5m"})
        await sendMail.sendForgottenPasswordEmail(email, accessToken)

        res.status(200).json({message: "Please check your email inbox"});
      } catch (error) {
        res.status(500).json({
            error: "Unable to load page"
        })
      }
    }

    // Reset Password
    const handleResetPassword = async(req, res)=>{
         const {password, confirmPassword} = req.body
         try {
            const user = await User.findOne({email: req.user.email})
            if (!user) {
                return res.status(404).json({
                    message: "User account does not exist."
                })
                 }
              if (password !== confirmPassword) {
                 return res.status(400).json({
                    message: "Password must match confirm password"
                 })
            }   
                const hashedPassword = await bcrypt.hash(password, 12)
                user.password = hashedPassword 
                await user.save()
                res.status(200).json({
                    message: "Password resset successful."
                })
           
         } catch (error) {
            res.status(500).json({
                error: "Unable to reset password"
            })
         }
    }

     const  handleGetAllUsers = async(req, res)=>{
    try {
        const allUsers = await findUserService()
    res.status(200).json({
        message: "Success",
        allUsers
    })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

 module.exports = {
    handleUserRegistration,
    handleUserLogin,
    handleForgottenPassword,
    handleResetPassword,
    handleGetAllUsers
 }
