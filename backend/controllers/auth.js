import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../services/sendEmail.js";

// Signup route
const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      address,
      state,
      city,
      zipCode,
      role,
      country,
      phone_number,
    } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(128).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        address,
        state,
        city,
        country,
        role,
        zipCode,
        phone_number,
        emailVerificationToken,
        emailVerificationExpires,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone_number: true,
        address: true,
        state: true,
        country: true,
        role:true,
        city: true,
        zipCode: true,
        createdAt: true,
      },
    });

    const encodedEmail = encodeURIComponent(email);
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?email=${encodedEmail}&token=${emailVerificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your NanoBite account",
      text: `Hi ${fullName || "there"},

Thanks for creating an account on NanoBite. Please verify your email address by clicking the link below:

${verificationLink}

This link will expire in 24 hours. If you did not create this account, you can safely ignore this email.`,
      html: `
        <p>Hi ${fullName || "there"},</p>
        <p>Thanks for creating an account on NanoBite. Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>This link will expire in 24 hours. If you did not create this account, you can ignore this email.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your email to activate the account.",
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if(!user?.isActive){
      return res
        .status(401)
        .json({ success: false, message: "User is Inactive, Contact your Administrator" });
    }
    if (user?.role !== "ADMIN" && !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before logging in.",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        data: { id: user.id, email: user.email },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        access_token: token,
        user: { id: user.id, email: user.email, fullName: user.fullName, role:user.role },
      });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate secure token and set expiry (1 hour)
    const challenge = crypto.randomBytes(128).toString("hex");
    const expiresInMs = 60 * 60 * 1000; // 1 hour
    const resetTokenExpires = Date.now() + expiresInMs;

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: challenge,
        resetPasswordExpires: new Date(Date.now() + expiresInMs),
      },
    });
    const encodedEmail = encodeURIComponent(email);
    const resetPasswordLink = `${process.env.FRONTEND_URL}/set-password?email=${encodedEmail}&challenge=${challenge}`;
    console.log(`Password reset link for ${email}: ${resetPasswordLink}`);

     // Define mail options
        const mailOptions = {
          to: email,
          subject: 'Reset Password',
          text: `A password reset was requested for your account. Use the link below to reset your password.\n\n${resetPasswordLink}\n\nIf you did not request this, please ignore this email.`,
          html: `
            <p>Dear ${user.name || 'User'},</p>
            <p>A password reset was requested for your account. Click the link below to reset your password:</p>
            <p><a href="${resetPasswordLink}">${resetPasswordLink}</a></p>
            <p>If the link doesn't work, copy and paste it into your browser.</p>
            <p><strong>If you did not request this, please ignore this email.</strong></p>
          `,
        };
    
        await sendEmail(mailOptions);
    
    res
      .status(200)
      .json({
        success: true,
        message: "Password reset link has been sent to your email (simulated)",
      });
  } catch (error) {
    console.error("Reset password error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

const setPassword = async (req, res) => {
  try {
    const { email, challenge, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      user.resetPasswordToken !== challenge ||
      user.resetPasswordExpires < new Date()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset link" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Set password error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
}

const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: "Email and token are required for verification.",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified. You can log in.",
      });
    }

    if (
      !user.emailVerificationToken ||
      user.emailVerificationToken !== token ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.user.data.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        email: true,
        fullName: true,
        phone_number: true,
        address: true,
        state: true,
        city: true,
        zipCode: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("User profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.data.id;
    const { fullName, phone_number, address, state, city, zipCode } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { fullName, phone_number, address, state, city, zipCode },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone_number: true,
        address: true,
        state: true,
        city: true,
        zipCode: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const auth = {
  signup,
  login,
  resetPassword,
  setPassword,
  verifyEmail,
  userProfile,
  updateProfile,
};
