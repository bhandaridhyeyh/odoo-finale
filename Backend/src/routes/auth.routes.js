// src/routes/auth.routes.js
import express from "express";
import passport from "passport";
import { register, login, refresh, logout, verifyEmail, sendOtp, verifyOtp, me } from "../controllers/auth.controller.js";
import authService from "../services/auth.service.js";

const router = express.Router();

// local
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", me);

// google oauth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  async (req, res) => {
    try {
      const user = req.user;
      const accessToken = authService.issueAccessToken(user);
      const refreshToken = await authService.createAndStoreRefresh(user._id);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?accessToken=${encodeURIComponent(accessToken)}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("Error in Google OAuth callback:", err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

export default router;
