// src/services/auth.service.js
import User from "../models/User.model.js";
import TokenModel from "../models/Token.model.js";
import { signAccessToken, signRefreshToken, randomToken, verifyToken } from "../utils/token.js";
import ms from "ms"; // small helper for durations; install or replace with numbers

const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "30d";
const EMAIL_TOKEN_EXPIRES = process.env.EMAIL_TOKEN_EXPIRES || "1d";

const registerUser = async (userData) => {
  const { email } = userData;
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");
  const user = await User.create(userData);
  // create email verification token
  const emailToken = randomToken(24);
  const expiresAt = new Date(Date.now() + (ms(EMAIL_TOKEN_EXPIRES) || 24 * 60 * 60 * 1000));
  await TokenModel.create({ userId: user._id, token: emailToken, type: "emailVerify", expiresAt });
  return { user, emailToken };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  const ok = await user.comparePassword(password);
  if (!ok) throw new Error("Invalid credentials");
  // sign tokens
  const payload = { sub: user._id.toString(), roles: user.roles };
  const accessToken = signAccessToken(payload, process.env.JWT_ACCESS_SECRET, ACCESS_TOKEN_EXPIRES);
  const refreshToken = signRefreshToken(payload, process.env.JWT_REFRESH_SECRET, REFRESH_TOKEN_EXPIRES);
  const expiresAt = new Date(Date.now() + (ms(REFRESH_TOKEN_EXPIRES) || 30 * 24 * 60 * 60 * 1000));
  await TokenModel.create({ userId: user._id, token: refreshToken, type: "refresh", expiresAt });
  return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("No refresh token provided");
  // verify token validity using JWT secret
  let payload;
  try {
    payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
  // check DB for refresh token
  const tokenDoc = await TokenModel.findOne({ token: refreshToken, type: "refresh" });
  if (!tokenDoc) throw new Error("Refresh token not found");
  const user = await User.findById(payload.sub);
  if (!user) throw new Error("User not found");
  const newAccessToken = signAccessToken({ sub: user._id.toString(), roles: user.roles }, process.env.JWT_ACCESS_SECRET, ACCESS_TOKEN_EXPIRES);
  return { accessToken: newAccessToken };
};

const logout = async (refreshToken) => {
  if (!refreshToken) return;
  await TokenModel.deleteOne({ token: refreshToken, type: "refresh" });
};

const verifyEmailToken = async (token) => {
  const doc = await TokenModel.findOne({ token, type: "emailVerify" });
  if (!doc) throw new Error("Invalid or expired email verification token");
  const user = await User.findById(doc.userId);
  if (!user) throw new Error("User not found");
  user.isVerified = true;
  await user.save();
  await TokenModel.deleteOne({ _id: doc._id });
  return user;
};

export default { registerUser, loginUser, refreshAccessToken, logout, verifyEmailToken };
