
const User = require("../models/User")

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const crypto = require("crypto")

const sendMail = require("../sendMail")
const {validEmail} = require("../sendMail")  
               


//  User registration
const handleUserRegistration = async(req, res) =>{
    try {
    const {firstName, lastName, email, phoneNumber, password, role} = req.body
     if (!validEmail(email)) {
            return res.status(400).json({
                message: "Incorrect email format"
            })
        }

      const existingUser = await User.findOne({email})
      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({
            message: "Account already exists."
        })
      }

    //   user exists buy not verified
    if (existingUser && !existingUser.isVerified) {
        return res.status(400).json({
            message: "Check your email for an activation code or click Resend to get another code."
        })
    }

      const existingPhoneNumber = await User.findOne({phoneNumber})

      if (existingPhoneNumber && existingPhoneNumber.isVerified) {
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
        const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpires = new Date(Date.now() + 5*60*1000); //5mins

        const newUser = new User({
             firstName, 
             lastName, 
             email,
             phoneNumber,  
             password: hashedPassword, 
             role,
             activationCode,
             codeExpires
        });
        await newUser.save();
        
        await sendMail.sendActivationCodeEmail(email, activationCode)


         res.status(201).json({
         message: "Registration successful. Check your email for activation code."
       })
        // res.status(201).json({
        //     message: "User account created successfully",
        //     newUser:{
        //         firstName,lastName, email, phoneNumber, role
        //     }
        // })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
    
 }

// Resend activation code

const handleResendActivationCode = async (req, res) => {
    const {email} = req.body
    try {
        const user = await User.findOne({email})
         if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
         }   
         if (user.isVerified) {
            return res.status(400).json({
                message: "Account already verified"
            })
         }

        //  generate new code
       const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
       const codeExpires = new Date(Date.now() + 10 * 60 * 1000)
        
       user.activationCode = activationCode
       user.codeExpires = codeExpires
       await user.save();

        await sendMail.resendActivationCodeEmail(email, activationCode, codeExpires)
      res.status(200).json({
        message: "Verification code sent successfully"
    })
    } catch (error) {
        res.status(500).json(
            error.message
        )
    }
}


//   Activation Code
    const handleActivationCode = async (req, res) =>{
       const {email, activationCode} = req.body
       try {
          const user = await User.findOne({email})

          if (!user) {
            return res.status(404).json({
                message: "User not found."
            })
            }  
          if (user.isVerified) {
            return res.status(400).json({
                message: "User account already verified."
            })
          }
          if (String(user.activationCode) !== String(activationCode)) {
            return res.status(400).json({
                message: "Invalid code!!."
            })
          }
          if (user.codeExpires && user.codeExpires < new Date()) {
             return res.status(400).json({
                message: "Code expired!"
             })
          }

          user.isVerified = true
          user.activationCode = null
          user.codeExpires = null

          await user.save()
          res.status(200).json({
            message: "Account verified successfully"
          })
       } catch (error) {
         res.status(500).json(
            error.message
         )
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
       
        if (!user.isVerified) {
            return res.status(401).json({
                message: "Please verify your eamil before logging in."
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
        const resetToken = await jwt.sign(
        {user}, 
        `${process.env.ACCESS_TOKEN}`, 
        {expiresIn: "10m"})
        await sendMail.sendForgottenPasswordEmail(user, resetToken)

        res.status(200).json({message: "Please check your email inbox"});
      } catch (error) {
        res.status(500).json({
            error: "Unable to load page"
        })
      }
    }

    // Reset Password
    const handleResetPassword = async(req, res)=>{
        const { userId, token } = req.params
         const {password, confirmPassword} = req.body
         try {
            const user = await User.findById({userId})
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
                    message: "Password reset successful."
                })
           
         } catch (error) {
            res.status(500).json({
                error: "Unable to reset password"
            })
         }
    }

    // Change password
    // Reset Password
    const handleChangePassword = async(req, res)=>{
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
                    message: "Password changed successful."
                })
           
         } catch (error) {
            res.status(500).json({
                error: "Unable to change password"
            })
         }
        }

    // user logout
    const handleUserLogout = async(req,res) =>{
        try {
            return res.status(200).json({
                message: "Logout successful",
                accessToken: null,
                refreshToken: null
            })
        } catch (error) {
            res.status(500).json({
                message: "Logged out"
            })
        }
    }



 module.exports = {
    handleUserRegistration,
    handleResendActivationCode,
    handleActivationCode,
    handleUserLogin,
    handleForgottenPassword,
    handleResetPassword,
    handleChangePassword,
    handleUserLogout
 }
