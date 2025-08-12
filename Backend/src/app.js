// src/app.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import setupPassport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import tripRoutes from "./routes/trips.routes.js";
import stopRoutes from "./routes/stops.routes.js";
import activityRoutes from "./routes/activities.routes.js";
import documentRoutes from "./routes/documents.routes.js";
import userRoutes from "./routes/users.routes.js";
import searchRoutes from "./routes/search.js";
import connectDB from "./db/mongoose.js";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
await connectDB();

// initialize passport
setupPassport();
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);

// simple health route
app.get("/api/health", (req, res) => res.json({ ok: true }));

// basic error handler (you have error.middleware, replace with it if you want)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

export default app;
