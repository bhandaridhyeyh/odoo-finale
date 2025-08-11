// src/config/index.js
import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:8080",
};
