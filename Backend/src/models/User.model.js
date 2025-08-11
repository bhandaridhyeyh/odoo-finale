// src/models/User.model.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  email: { type: String, trim: true, lowercase: true, required: true, unique: true },
  phone: { type: String, trim: true },
  city: { type: String },
  country: { type: String },
  password: { type: String }, // for OAuth users this may be undefined
  avatarUrl: { type: String },
  isVerified: { type: Boolean, default: false }, // email verification
  roles: { type: [String], default: ["user"] }, // e.g. ['user', 'admin']
  oauthProvider: { type: String }, // 'google' etc.
  oauthId: { type: String }, // provider id
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// hash password before save when modified
UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  if (!user.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidate) {
  if (!this.password || !candidate) return false;
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
