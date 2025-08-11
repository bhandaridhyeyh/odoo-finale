// src/utils/token.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

const signAccessToken = (payload, secret, expiresIn = "15m") => {
  return jwt.sign(payload, secret, { expiresIn });
};

const signRefreshToken = (payload, secret, expiresIn = "30d") => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const randomToken = (size = 48) => {
  return crypto.randomBytes(size).toString("hex");
};

export { signAccessToken, signRefreshToken, verifyToken, randomToken };
