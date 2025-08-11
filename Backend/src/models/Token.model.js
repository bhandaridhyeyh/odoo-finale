// src/models/Token.model.js
import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true }, // could be email verification token, OTP, or refresh token
  type: { type: String, enum: ["refresh", "emailVerify", "emailOtp"], required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // optional TTL if you set expiresAt

const Token = mongoose.model("Token", TokenSchema);
export default Token;
