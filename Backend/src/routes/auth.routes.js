// src/routes/auth.routes.js
import express from "express";
import passport from "passport";
import { register, login, refresh, logout, verifyEmail } from "../controllers/auth.controller.js";

const router = express.Router();

// local
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);

// google oauth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    // successful auth, issue tokens and redirect to frontend with tokens (or set cookies)
    const user = req.user;
    // sign tokens same as login flow
    import("../services/auth.service.js").then(({ default: authService }) => {
      const payload = { sub: user._id.toString(), roles: user.roles };
      const accessToken = require("jsonwebtoken").sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" });
      const refreshToken = require("jsonwebtoken").sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "30d" });
      // store refresh token in DB
      const TokenModel = require("../models/Token.model.js").default;
      const expiresAt = new Date(Date.now() + (require("ms")(process.env.REFRESH_TOKEN_EXPIRES || "30d") || 30 * 24 * 60 * 60 * 1000));
      TokenModel.create({ userId: user._id, token: refreshToken, type: "refresh", expiresAt })
        .then(() => {
          // set cookie and redirect to frontend with tokens in query or fragment
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 30,
          });
          const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}`;
          res.redirect(redirectUrl);
        })
        .catch((err) => {
          console.error("Error saving refresh token:", err);
          res.redirect(`${process.env.FRONTEND_URL}/login`);
        });
    });
  }
);

export default router;
