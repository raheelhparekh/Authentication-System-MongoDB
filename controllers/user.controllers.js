import User from "../models/User.models.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All field are required",
      success: false,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const user = await User.create({ name, email, password });
    // console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "user not created",
        success: false,
      });
    }

    // creating token from crypto
    const token = crypto.randomBytes(32).toString("hex");
    // console.log(token);

    // save token in database
    user.verificationToken = token;
    await user.save();

    console.log("Sending mail to:", user.email);

    try {
      // send token as email to user using nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });

      const info = transporter.sendMail({
        from: process.env.MAILTRAP_SENDEREMAIL, // sender address
        to: user.email, // list of receivers
        subject: "Verify your Email", // Subject line
        text: `Please click on the following link ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
        html: "<b>Hello world?</b>", // html body
      });

      console.log("Email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
      console.error(
        "Full error:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      return res.status(500).json({
        message: "Email not sent",
        success: false,
        error: error.message || error.toString(),
      });
    }
    return res.status(200).json({
      message: "User registered succesfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "User not registered",
      error,
      success: false,
    });
  }
};

const verifyUser = async (req, res) => {
  // get token from params
  const { token } = req.params;

  try {
    if (!token) {
      return res.status(400).json({
        message: "Token not found/ Invalid",
        success: false,
      });
    }

    const validateUser = await User.findOne({ verificationToken: token });
    if (!validateUser) {
      return res.status(400).json({
        message: "No user found with this token",
        success: false,
      });
    }

    // setting isVerified to true
    validateUser.isVerified = true;

    // remove verification token
    validateUser.verificationToken = undefined;

    await validateUser.save();

    return res.status(200).json({
      message: " User verified succesfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "User not verified",
      error,
      success: false,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All field are required",
      success: false,
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect Password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_SECRET_EXPIRY,
    });
    // console.log(token);

    // sending token in cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "User logged in",
      success: true,
      user: {
        id: user._id,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "User not logged in",
      success: false,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      message: "User found",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot find profile",
      success: false,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "");

    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: " Error occured while logging out",
      success: false,
      error,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: " email is required",
      success: false,
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "no user found with this email",
        success: false,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);

    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    console.log("Sending mail to:", user.email);

    try {
      // send token as email to user using nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });

      const info = transporter.sendMail({
        from: process.env.MAILTRAP_SENDEREMAIL, // sender address
        to: user.email, // list of receivers
        subject: "Reset your password", // Subject line
        text: `Please click on the following link to reset your password ${process.env.BASE_URL}/api/v1/users/reset-password/${token}`,
        html: "<b>Reset Password</b>", // html body
      });

      console.log("Email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
      console.error(
        "Full error:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      return res.status(500).json({
        message: "Email not sent",
        success: false,
        error: error.message || error.toString(),
      });
    }

    await user.save();

    return res.status(200).json({
      message: " Link has been sent to reset your password",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "some error occured in forgot password",
      success: false,
    });
  }
};

const resetPassword = async (req, res) => {
  // get token from params
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    return res.status(400).json({
      message: "No token found",
      success: false,
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "password cannot be empty",
      success: false,
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
        success: false,
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      message: "password reset done",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "some error occurred while resetting password",
      success: false,
      error,
    });
  }
};

export {
  registerUser,
  verifyUser,
  login,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword,
};
