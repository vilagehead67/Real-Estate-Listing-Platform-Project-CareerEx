
const crypto = require("crypto")
const nodemailer = require("nodemailer")



const sendActivationCodeEmail = async(email, activationCode) =>{
   try {
      const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.EMAIL_PASSWORD}`
         }
      })

       const mailOptions = {
         from: `${process.env.EMAIL}`,
         to: `${email}`,
         subject: " Real Estate activation Code Notification",
         html: `<html>Copy and paste the 6-digit code to activate your account  
         <a> Your activation code is: ${activationCode}</a> 
         </html>`
       };

       await transporter.sendMail(mailOptions)
   } catch (error) {
      console.log(error.message)
   }
}

const resendActivationCodeEmail = async(email, activationCode) =>{
   try {
           //    send new email
    const transporter = nodemailer.createTransport({
             service: "gmail",
             auth: {
                user: `${process.env.EMAIL}`,
                pass: `${process.env.EMAIL_PASSWORD}`
             }
          })

    const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: "Resend activation code",
        text: `Your new activation code is: ${activationCode}`
    }

    await transporter.sendMail(mailOptions)
   } catch (error) {
      console.log(error.message)
   }
}

const sendForgottenPasswordEmail = async (email, token) => {
     try {
        const mailTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                   user: `${process.env.EMAIL}`,
                   pass: `${process.env.EMAIL_PASSWORD}`
                 }
        })

        const mailDetails = {
            from: `${process.env.EMAIL}`,
            to: `${email}`,
            subject: "Reset Password Notification",
            html: `<html>Here is a token to reset your password. CLICK on the link below
                   <a style= "display: inline-block; padding: 8px 16px; 
                   background-color: #007BFF; color: white; text-decoration: none;
                   border-radius: 4px; font-size: 16px; font-family: Arial, sans-serif;
                   " href='https://www.examplaza.com/reset-password/${token}>Reset Password</a>

                   if the button does not work for any reason, please click on link below
                   <a href='https://www.examplaza.com/reset-password/${token}>Reset Password</a>
            </html>`
        }
        await mailTransport.sendMail(mailDetails)
     } catch (error) {
        console.log(error)
     }
} 

const validEmail = (email) =>{
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(String(email).toLowerCase())
    }

    module.exports = {
       sendActivationCodeEmail,
       resendActivationCodeEmail,
       sendForgottenPasswordEmail,
       validEmail
    }