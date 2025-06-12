
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const User = require("./models/User")



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

const sendForgottenPasswordEmail = async (user, token) => {
  try {
    const mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetLink = `https://real-estate-listing-platform-project.onrender.com/api/reset-password/${user._id}/${token}`;

    const mailDetails = {
      from: `"HomeFinder Support" <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Reset Password Notification",
      html: `
        <p>Hello ${user.firstName},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a style="
          display: inline-block;
          padding: 6px 12px;
          background-color: #007BFF;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 12px;
          font-family: Arial, sans-serif;"
          href="${resetLink}">
          Reset Password
        </a>
        <p>If the button doesn’t work, you can also click or copy the link below:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await mailTransport.sendMail(mailDetails);
    console.log("Password reset email sent to:", user.email);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};


const validEmail = (email) =>{
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(String(email).toLowerCase())
    }

const sendAdminNotification = async(property) =>{
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Property Listing Submitted",
      html: `
           <h3>New Property Listing</h3>
           <p><strong>Title:</strong> ${property.title}</p>
           <p><strong>Price:</strong> ${property.price}</p>
           <p><strong>Agent ID:</strong> ${property.agent}</p>
           <p><strong>Status:</strong> ${property.status}</p>
           <p> Please login to review and approve this listing.</p>
           `
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log("Failed to send admin notification:", error.message)
  }
}    

const sendApprovalNotification = async(email, propertyTitle) => {
   const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Property Listing Approved",
    html: `<p>Your property <strong>${propertyTitle}</strong> has been approved and is now visible to the public.</p>`,
  };
   await transporter.sendMail(mailOptions)
}    

    module.exports = {
       sendActivationCodeEmail,
       resendActivationCodeEmail,
       sendForgottenPasswordEmail,
       validEmail,
       sendAdminNotification,
       sendApprovalNotification
    }