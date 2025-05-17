import nodemailer from "nodemailer";

const sendVerificationMail = async (email, token) => {
  try {
    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    // Send verification email
    const info = await transporter.sendMail({
      from: process.env.MAILTRAP_SENDEREMAIL, // sender address
      to: email, // list of receivers
      subject: "Email Verification - Action Required", // Subject line
      text: `Hello,\n\nPlease verify your email by clicking the following link: ${process.env.BASE_URL}/api/v1/users/verify/${token}\n\nIf you didn't request this, please ignore this email.`,
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .button { background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
              .footer { font-size: 12px; color: #888; margin-top: 20px; }
            </style>
          </head>
          <body>
            <h2>Email Verification</h2>
            <p>Hello,</p>
            <p>Please verify your email by clicking the button below:</p>
            <a href="${process.env.BASE_URL}/api/v1/users/verify/${token}" class="button">Verify Email</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p class="footer">This email was sent by [Your Company Name].</p>
          </body>
        </html>
      `
    });

    console.log("Verification email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }
};

const sendResetPasswordEmail = async (email, token) => {
  try {
    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    // Send password reset email
    const info = await transporter.sendMail({
      from: process.env.MAILTRAP_SENDEREMAIL, // sender address
      to: email, // list of receivers
      subject: "Password Reset Request", // Subject line
      text: `Hello,\n\nYou requested to reset your password. Click the link below to reset it: ${process.env.BASE_URL}/api/v1/users/reset-password/${token}\n\nIf you didn't request this, please ignore this email.`,
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .button { background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
              .footer { font-size: 12px; color: #888; margin-top: 20px; }
            </style>
          </head>
          <body>
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <a href="${process.env.BASE_URL}/api/v1/users/reset-password/${token}" class="button">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p class="footer">This email was sent by [Your Company Name].</p>
          </body>
        </html>
      `
    });

    console.log("Password reset email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }
};

export { sendVerificationMail, sendResetPasswordEmail };