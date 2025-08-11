// src/controllers/auth.controller.js
import authService from "../services/auth.service.js";
import emailService from "../services/email.service.js"; // we'll give a simple email service below

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, city, country } = req.body;
    const { user, emailToken } = await authService.registerUser({
      firstName, lastName, email, password, phone, city, country
    });
    // send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailToken}`;
    await emailService.sendEmailVerification(user.email, user.firstName, verifyUrl);
    return res.status(201).json({ message: "Registered. Check your email to verify your account." });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
    // set refresh token as httpOnly cookie (recommended)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // match refresh expiry roughly
    });
    return res.json({ user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, isVerified: user.isVerified }, accessToken });
  } catch (err) {
    return next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    // prefer cookie; fallback to body
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    const { accessToken } = await authService.refreshAccessToken(refreshToken);
    return res.json({ accessToken });
  } catch (err) {
    return next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    await authService.logout(refreshToken);
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out" });
  } catch (err) {
    return next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await authService.verifyEmailToken(token);
    // optional: redirect to frontend success page
    return res.json({ message: "Email verified", user: { id: user._id, email: user.email } });
  } catch (err) {
    return next(err);
  }
};

// OAuth callbacks handled by passport routes (below)
